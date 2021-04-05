import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren} from '@angular/core';
import {Edge, Network, Node} from 'vis-network';
import {DataSet} from 'vis-data';
import {NetworkService} from '../network.service';
import {CategoryNode, KeywordNode, NetworkNode} from '../_types/NetworkNode';
import {NetworkEdge} from '../_types/NetworkEdge';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {NgbTypeaheadSelectItemEvent} from '@ng-bootstrap/ng-bootstrap';
import {Paper} from '../_types/Paper';


enum GraphType {
  OVERVIEW,
  CATEGORY,
  KEYWORD
}

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements AfterViewInit {


  @ViewChildren('network') ql: QueryList<ElementRef>;
  el: ElementRef;

  loaded = false; // check if network was drawn for the first time so the html element is fully initialized
  graphType = GraphType.OVERVIEW; // currently shown graph type
  allGraphType = GraphType;

  networkInstance: any;
  networkData: any;

  selectedNodes = new Set<string>();

  tooltip: {
    pos: {
      left: number,
      top: number,
    },
    selectedNode?: KeywordNode,
    selectedCategory?: CategoryNode,
    selectedEdge?: NetworkEdge,
  } = {
    pos: {
      left: 0,
      top: 0,
    },
    selectedNode: null,
    selectedCategory: null,
    selectedEdge: null,
  };

  papers: Paper[];

  // Contains all nodes in the database
  nodes: KeywordNode[];
  nodeMap = new Map<number, KeywordNode>(); // Node name -> node

  categories: CategoryNode[];
  categoryByIdMap = new Map<number, CategoryNode>();
  categoryByNameMap = new Map<string, CategoryNode>();

  // The current edges: the graph is defined by the edges.
  currentEdges: NetworkEdge[];
  currentEdgeMap; // Edge id -> edge; the edge id has the form "<node1>@@@<node2>".

  @Input() hideEdges = false;
  @Output() hideEdgesChange = new EventEmitter<boolean>();
  edgeThreshold = 500; // hide edges on default above threshold

  @Input() freezeGraph = false;
  @Output() freezeGraphChange = new EventEmitter<boolean>();

  @Input() edgeSlider = 1;
  @Output() edgeSliderChange = new EventEmitter<number>();

  progress = 0; // progress for loading and simulation

  visOptions = {
    nodes: {
      shape: 'dot',
      scaling: {
        min: 10,
        max: 100,
      },
      font: {
        size: 24,
        face: 'Tahoma',
      },
    },
    edges: {
      color: {
        color: '#b5d2f9',
        highlight: '#0026af'
      },
      scaling: {
        min: 0.1,
        max: 10,
      },
      smooth: {
        enabled: true,
        type: 'continuous',
        roundness: 0.5,
      },
    },
    physics: {
      stabilization: {
        iterations: 500,
        updateInterval: 50,
      },
      barnesHut: {
        theta: 1.0,
        gravitationalConstant: -80000,
        springConstant: 0.001,
        avoidOverlap: 1,
      },
    },
    layout: {
      improvedLayout: false,
      randomSeed: 1,
    },
    interaction: {
      tooltipDelay: 200,
      hideEdgesOnDrag: false,
    },
    groups: {},
  };

  constructor(
    private networkService: NetworkService,
  ) {
  }

  /**
   * Transform our edge object to a vis.js edge.
   */
  private static toVisEdge(edge: NetworkEdge, hide: boolean = false): any {
    return {
      id: edge.id,
      from: edge.node1,
      to: edge.node2,
      value: edge.weight,
      hidden: hide,
    };
  }

  /**
   * Transform all categories to vis groups and apply colors
   */
  private static toVisGroups(categories: CategoryNode[]): any {
    const groups = {};
    for (const category of categories) {
      groups[category.name] = {color: `hsl( ${category.rank * (360 / categories.length)},100%,50%)`};
    }
    return groups;
  }

  // add a hidden node, connected to all other nodes, to avoid unconnected graphs
  private static addCentralNode(nodes: any[], edges: any[]): void {
    nodes.push({
      id: 'hidden',
      hidden: true,
      value: 1,
    });
    nodes.forEach((node, i) => {
      edges.push({
        id: `hidden${i}`,
        from: 'hidden',
        to: node.id,
        hidden: false,
        value: 1,
      });
    });
  }

  searchKeyword = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.nodes.map(n => n.name).filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  }

  async ngAfterViewInit(): Promise<void> {
    await this.initData();
    // wait until fully loaded
    this.ql.changes.subscribe(async () => {
      // draw overview only on first view change
      if (!this.loaded) {
        this.el = this.ql.first;
        await this.drawCategoryGraph();
      }
      this.loaded = true;
    });
  }

  async addKeywordEvent($event: NgbTypeaheadSelectItemEvent<string>, input) {
    $event.preventDefault();
    input.value = '';
    await this.addKeyword($event.item);
  }

  async addKeyword(keyword) {
    this.selectedNodes.add(keyword);
    await this.loadKeywordGraph();
  }

  async removeKeyword(nodeName: string) {
    this.selectedNodes.delete(nodeName);
    await this.loadKeywordGraph();
  }

  public showCategoryGraph() {
    this.selectedNodes.clear();
    if (this.loaded) {
      this.drawCategoryGraph();
    }
  }

  async openCategoryGraph(category: string) {
    this.progress = 0; // indicate loading while waiting for edge result
    const edges = await this.networkService.getCategoryGraphForCategory(category);
    const nodes = await this.networkService.getNodesFromCategory(category);
    this.setHideEdges(edges.length > this.edgeThreshold);
    this.drawGraph(edges, nodes, GraphType.CATEGORY, true);
  }

  public onHideEdgesChange(hideEdges) {
    this.hideEdges = hideEdges;
    const toChange = this.networkData.edges.get({filter: edge => edge.hidden !== hideEdges});
    toChange.forEach(edge => edge.hidden = hideEdges);
    this.networkData.edges.update(toChange);
    this.setEdgeSlider(1);
  }

  public onFreezeGraphChange(freezeGraph) {
    this.freezeGraph = freezeGraph;
    this.networkInstance.setOptions({physics: !freezeGraph});
  }

  async changeSlider(value) {
    this.edgeSlider = value;
    this.setHideEdges(false);
    this.updateEdgeVisibility();
  }

  /**
   * Transform our node object to a vis.js node.
   */
  private toVisNode(node: NetworkNode, shape = 'dot'): any {
    if ('categories' in node) { // keyword node
      return {
        id: node.id,
        label: node.name,
        title: node.name,
        value: node.weight,
        shape,
        group: this.getHighestRankCategory(node.categories),
        nodeType: 'keyword',
      };
    } else { // category node
      return {
        id: node.id,
        label: node.name,
        title: node.name,
        value: node.weight,
        shape,
        group: node.name,
        nodeType: 'category',
      };
    }
  }

  private async initData() {
    // Fetch all nodes
    this.nodes = await this.networkService.getNodes();
    this.categories = await this.networkService.getCategories();
    for (const node of this.nodes) {
      this.nodeMap.set(node.id, node);
    }
    for (const node of this.categories) {
      this.categoryByIdMap.set(node.id, node);
      this.categoryByNameMap.set(node.name, node);
    }
    this.visOptions.groups = NetworkComponent.toVisGroups(this.categories);
  }

  private async loadKeywordGraph() {
    this.progress = 0; // indicate loading while waiting for edge result
    const currentSelection = new Array<string>(...this.selectedNodes);
    let edges: NetworkEdge[];
    if (currentSelection.length === 0) {
      edges = [];
    } else if (currentSelection.length === 1) {
      edges = await this.networkService.getEgoGraph(currentSelection[0]);
    } else {
      edges = await this.networkService.getShortestPathGraph(currentSelection);
    }

    // Check if the selections have changed:
    if (currentSelection.length !== this.selectedNodes.size) {
      return;
    }
    for (const n of currentSelection) {
      if (!this.selectedNodes.has(n)) {
        return;
      }
    }

    const nodeSet = new Set<number>(); // Node names
    for (const e of edges) {
      nodeSet.add(e.node1);
      nodeSet.add(e.node2);
    }
    const nodes = [...nodeSet].map(n => this.nodeMap.get(n));
    this.setHideEdges(edges.length > this.edgeThreshold);
    this.drawGraph(edges, nodes, GraphType.KEYWORD);
  }

  private async drawCategoryGraph() {
    this.progress = 0; // indicate loading while waiting for edge result
    const edges = await this.networkService.getCategoryGraph();
    const nodes = this.categories.filter(node => node.name !== 'others');
    this.setHideEdges(false);
    this.drawGraph(edges, nodes, GraphType.OVERVIEW);
  }

  private drawGraph(edges: NetworkEdge[], nodes: NetworkNode[], graphType: GraphType, centralNode: boolean = false) {
    const container = this.el.nativeElement;
    this.graphType = graphType;

    // reset ui elements
    this.resetTooltip();
    this.progress = 0;
    this.setEdgeSlider(1);

    // Save the edges for tooltip
    this.currentEdgeMap = new Map();
    for (const edge of edges) {
      if (edge.node1 < edge.node2) {
        edge.id = `${edge.node1}@@@${edge.node2}`;
      } else {
        edge.id = `${edge.node2}@@@${edge.node1}`;
      }
      if (this.graphType === GraphType.OVERVIEW) {
        edge.node1Name = this.categoryByIdMap.get(edge.node1).name;
        edge.node2Name = this.categoryByIdMap.get(edge.node2).name;
      } else {
        edge.node1Name = this.nodeMap.get(edge.node1).name;
        edge.node2Name = this.nodeMap.get(edge.node2).name;
      }
      this.currentEdgeMap.set(edge.id, edge);
    }
    this.currentEdges = edges;

    const visEdges = edges.map(edge => NetworkComponent.toVisEdge(edge, this.hideEdges));
    const visNodes = nodes.map(node => {
      if (this.selectedNodes.has(node.name)) {
        return this.toVisNode(node, 'triangle');
      } else {
        return this.toVisNode(node);
      }
    });

    if (centralNode) {
      NetworkComponent.addCentralNode(visNodes, visEdges);
    }

    const data = {
      nodes: new DataSet<Node>(visNodes),
      edges: new DataSet<Edge>(visEdges)
    };
    this.networkData = data;
    this.networkInstance = new Network(container, data, this.visOptions);

    // Adds event listener to display a tooltip if a node or an edge is selected.
    const selectionChangedEvent = ($event) => {
      this.resetTooltip();

      // A node was selected.
      if ($event.nodes.length === 1) {
        this.updateEdgeVisibility();
        if (this.graphType === GraphType.OVERVIEW) {
          this.tooltip.selectedCategory = this.categoryByIdMap.get($event.nodes[0]);
        } else {
          this.tooltip.selectedNode = this.nodeMap.get($event.nodes[0]);
        }
        if (this.hideEdges || this.edgeSlider > 1) {
          const toChange = this.networkData.edges.get(this.networkInstance.getConnectedEdges($event.nodes[0]));
          toChange.forEach(edge => edge.hidden = false);
          this.networkData.edges.update(toChange);
          // this.networkInstance.getConnectedEdges($event.nodes[0])
          //   .forEach(edge => this.networkInstance.body.data.edges.update({id: edge.id, hidden: false}));
        }
      }
      // An edge was selected.
      else if ($event.nodes.length === 0 && $event.edges.length === 1) {
        this.tooltip.selectedEdge = this.currentEdgeMap.get($event.edges[0]);
        this.fetchPapers(this.tooltip.selectedEdge)
          .then((papers) => {
            // Make sure that the edge is still selected.
            if (this.tooltip.selectedEdge === $event.edges[0]) {
              return;
            }
            this.papers = papers
              .filter(p => !!p.title) // Only show those with a title
              .sort((p1, p2) => { // Show the recent publications above
                if (!p1.year) {
                  return 1;
                }
                if (!p2.year) {
                  return -1;
                }
                return p2.year - p1.year;
              })
              .slice(0, 20); // Limit the number (in the future, we could add pagination)
          });
      } else {
        this.updateEdgeVisibility();
      }

      const pos = $event.event.center;
      this.tooltip.pos.left = pos.x;
      this.tooltip.pos.top = pos.y;
    };

    this.networkInstance.on('stabilizationProgress', params => {
      const progress = params.iterations / params.total;
      this.progress = progress * 100;
    });
    this.networkInstance.once('stabilizationIterationsDone', () => {
      this.progress = 100;
      this.setFreezeGraph(true);
    });

    this.networkInstance.addEventListener('click', selectionChangedEvent);
  }

  private resetTooltip() {
    this.tooltip.selectedNode = null;
    this.tooltip.selectedCategory = null;
    this.tooltip.selectedEdge = null;
    this.papers = null;
  }

  private updateEdgeVisibility() {
    if (this.hideEdges) {
      const toHide = this.networkData.edges.get({filter: edge => !edge.hidden});
      toHide.forEach(edge => edge.hidden = true);
      this.networkData.edges.update(toHide);
    } else if (this.edgeSlider > 1) {
      const toChange = this.networkData.edges.get({
        filter: edge => (edge.value < this.edgeSlider && edge.hidden === false)
          || (edge.value >= this.edgeSlider && edge.hidden === true)
      });
      toChange.forEach(edge => edge.hidden = edge.value < this.edgeSlider);
      this.networkData.edges.update(toChange);
    }
  }

  private setHideEdges(hideEdges) {
    this.hideEdges = hideEdges;
    this.hideEdgesChange.emit(hideEdges);
  }

  private setFreezeGraph(freezeGraph) {
    this.freezeGraph = freezeGraph;
    this.networkInstance.setOptions({physics: !freezeGraph});
    this.freezeGraphChange.emit(freezeGraph);
  }

  private setEdgeSlider(edgeSlider) {
    this.edgeSlider = edgeSlider;
    this.edgeSliderChange.emit(edgeSlider);
  }

  private getHighestRankCategory(categories: string[]) {
    return categories.sort((a, b) => this.categoryByNameMap.get(b).rank - this.categoryByNameMap.get(a).rank)[0];
  }

  private async fetchPapers(edge: NetworkEdge): Promise<Paper[]> {
    if (!edge.references || edge.references.length === 0) { // This should never be the case but who knows...
      return [];
    }
    return this.networkService.getPapers(edge.references.slice(0, -1).split(',').map(s => parseInt(s, 10)));
  }
}
