import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Network, DataSet, Node, Edge } from 'vis';
import { NetworkService } from '../network.service';
import { NetworkNode } from '../_types/NetworkNode';
import { NetworkEdge } from '../_types/NetworkEdge';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Paper } from '../_types/Paper';


@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements AfterViewInit {

  @ViewChild('network') el: ElementRef;
  networkInstance: any;
  selectedNodes = new Set<string>();
  tooltip: {
    pos: {
      left: number,
      top: number,
    },
    selectedNode?: NetworkNode,
    selectedEdge?: NetworkEdge,
  } = {
    pos: {
      left: 0,
      top: 0,
    },
    selectedNode: null,
    selectedEdge: null,
  };
  papers: Paper[];

  // Contains all nodes in the database
  nodes: NetworkNode[];
  nodeMap = new Map<string, NetworkNode>(); // Node name -> node

  // The current edges: the graph is defined by the edges.
  currentEdges: NetworkEdge[];
  currentEdgeMap; // Edge id -> edge; the edge id has the form "<node1>@@@<node2>".

  visOptions = {
    nodes: {
      shape: 'dot',
      scaling: {
        min: 10,
        max: 50,
      },
      font: {
        size: 12,
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
        max: 3,
      },
      smooth: {
        enabled: true,
        type: 'continuous',
        roundness: 0.5,
      },
    },
    physics: {
      stabilization: false,
      barnesHut: {
        gravitationalConstant: -80000,
        springConstant: 0.001,
        springLength: 200,
      },
    },
    layout: {
      improvedLayout: false,
    },
    interaction: {
      tooltipDelay: 200,
      hideEdgesOnDrag: false,
    },
  };


  /**
   * Transform our node object to a vis.js node.
   */
  private static toVisNode(node: NetworkNode, shape = 'dot', color = '#5dbdd5'): any {
    return {
      id: node.name,
      label: node.name,
      title: node.name,
      value: node.weight,
      shape,
      color,
    };
  }


  /**
   * Transform our edge object to a vis.js edge.
   */
  private static toVisEdge(edge: NetworkEdge): any {
    return {
      id: edge.id,
      from: edge.node1,
      to: edge.node2,
      value: edge.weight
    };
  }


  searchKeyword = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.nodes.map(n => n.name).filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  }


  constructor(
    private networkService: NetworkService,
  ) {
  }


  ngAfterViewInit(): void {
    this.init();
  }


  private async init() {
    // Fetch all nodes
    this.nodes = await this.networkService.getNodes();
    for (const node of this.nodes) {
      this.nodeMap.set(node.name, node);
    }
  }


  async addKeyword($event: NgbTypeaheadSelectItemEvent<string>, input) {
    $event.preventDefault();
    input.value = '';
    this.selectedNodes.add($event.item);
    await this.loadGraph();
  }


  async removeKeyword(nodeName: string) {
    this.selectedNodes.delete(nodeName);
    await this.loadGraph();
  }


  private async loadGraph() {
    const nodes = new Array<string>(...this.selectedNodes);
    let edges: NetworkEdge[];
    if (nodes.length === 0) {
      edges = [];
    } else if (nodes.length === 1) {
      edges = await this.networkService.getEgoGraph(nodes[0]);
    } else {
      edges = await this.networkService.getShortestPathGraph(nodes);
    }

    // Check if the selections have changed:
    const oldSelectedNodes = new Set(nodes);
    if (oldSelectedNodes.size !== this.selectedNodes.size) {
      return;
    }
    for (const n of oldSelectedNodes) {
      if (!this.selectedNodes.has(n)) {
        return;
      }
    }

    // Save the edges
    this.currentEdgeMap = new Map();
    for (const edge of edges) {
      if (edge.node1 < edge.node2) {
        edge.id = `${ edge.node1 }@@@${ edge.node2 }`;
      } else {
        edge.id = `${ edge.node2 }@@@${ edge.node1 }`;
      }
      this.currentEdgeMap.set(edge.id, edge);
    }
    this.currentEdges = edges;

    this.drawGraph(this.currentEdges, this.selectedNodes);
  }


  private drawGraph(edges: NetworkEdge[], selectedNodes?: Set<string>) {
    const container = this.el.nativeElement;
    const data = this.toVisData(edges, selectedNodes);
    this.networkInstance = new Network(container, data, this.visOptions);

    // Adds event listener to display a tooltip if a node or an edge is selected.
    const selectionChanged = ($event) => {
      this.tooltip.selectedNode = null;
      this.tooltip.selectedEdge = null;
      this.papers = null;

      if ($event.nodes.length === 1) {
        // A node was selected.
        this.tooltip.selectedNode = this.nodeMap.get($event.nodes[0]);
      } else if ($event.nodes.length === 0 && $event.edges.length === 1) {
        // An edge was selected.
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
      }

      const pos = $event.event.center;
      this.tooltip.pos.left = pos.x;
      this.tooltip.pos.top = pos.y;
    };
    this.networkInstance.addEventListener('select', selectionChanged);
  }


  /**
   *
   * @param edges The edges that define the graph.
   * @param selectedNodes The names of the nodes that the user has explicitly selected. They will be highlighted.
   */
  private toVisData(edges: NetworkEdge[], selectedNodes = new Set<string>()): { nodes: DataSet<Node>, edges: DataSet<Edge> } {
    const nodeSet = new Set<string>(); // Node names
    const visEdges = [];
    const visNodes = [];

    for (const e of edges) {
      nodeSet.add(e.node1);
      nodeSet.add(e.node2);
      visEdges.push(NetworkComponent.toVisEdge(e));
    }

    nodeSet.forEach((n) => {
      if (selectedNodes.has(n)) {
        visNodes.push(NetworkComponent.toVisNode(this.nodeMap.get(n), 'triangle', '#90ee90'));
      } else {
        visNodes.push(NetworkComponent.toVisNode(this.nodeMap.get(n)));
      }
    });

    return {
      nodes: new DataSet<Node>(visNodes),
      edges: new DataSet<Edge>(visEdges)
    };
  }


  private async fetchPapers(edge: NetworkEdge): Promise<Paper[]> {
    if (!edge.references || edge.references.length === 0) { // This should never be the case but who knows...
      return [];
    }
    return this.networkService.getPapers(edge.references.slice(0, -1).split(',').map(s => parseInt(s, 10)));
  }
}
