import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService } from './backend.service';
import { NetworkEdge } from './_types/NetworkEdge';
import { KeywordNode } from './_types/NetworkNode';
import { CategoryNode } from './_types/NetworkNode';
import { Paper } from './_types/Paper';


/**
 * This class does not implement the observable data service model but returns the results directly in promises because it assumes that
 * the fetched data are mostly very individual. Besides of a fixed set of nodes, there is no need for caching and there will not be multiple
 * components using this service and wanting to subscribe the data at the same time.
 */
@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  /**
   * The nodes are assumed to be a fixed set so that there will be no need for reloading.
   */
  private nodes: KeywordNode[];

  private categories: CategoryNode[];

  private categoryGraph: NetworkEdge[];

  constructor(
    private http: HttpClient,
    private backendService: BackendService,
  ) {
  }


  getNodes(): Promise<KeywordNode[]> {
    return new Promise<KeywordNode[]>((resolve, reject) => {
      if (this.nodes) {
        resolve(this.nodes);
        return;
      }
      this.http.get<KeywordNode[]>(`${this.backendService.url}/network/node`).subscribe(
        (nodes) => {
          this.nodes = nodes;
          resolve(nodes);
        },
        reject
      );
    });
  }

  getCategories(): Promise<CategoryNode[]> {
    return new Promise<CategoryNode[]>((resolve, reject) => {
      if (this.categories) {
        resolve(this.categories);
        return;
      }
      this.http.get<CategoryNode[]>(`${this.backendService.url}/network/categories`).subscribe(
        (nodes) => {
          this.categories = nodes;
          resolve(nodes);
        },
        reject
      );
    });
  }


  getEgoGraph(nodeName: string): Promise<NetworkEdge[]> {
    return new Promise<NetworkEdge[]>((resolve, reject) => {
      this.http.get<NetworkEdge[]>(`${this.backendService.url}/network/graph/ego?node=${ nodeName }`).subscribe(
        (edges) => {
          resolve(edges);
        },
        reject
      );
    });
  }


  getShortestPathGraph(nodeNames: string[]): Promise<NetworkEdge[]> {
    return new Promise<NetworkEdge[]>((resolve, reject) => {
      this.http.get<NetworkEdge[]>(`${this.backendService.url}/network/graph/shortest_path?nodes=${ nodeNames.join(',') }`).subscribe(
        (edges) => {
          resolve(edges);
        },
        reject
      );
    });
  }


  getPapers(ids: number[]): Promise<Paper[]> {
    return new Promise<Paper[]>((resolve, reject) => {
      this.http.get<Paper[]>(`${this.backendService.url}/network/paper?ids=${ ids.join(',') }`).subscribe(
        (paper) => {
          resolve(paper);
        },
        reject
      );
    });
  }

  getNodesFromCategory(category: string): Promise<KeywordNode[]> {
    return new Promise<KeywordNode[]>((resolve, reject) => {
      if (!this.nodes) {
        reject();
      }
      resolve(this.nodes.filter(node => node.categories.find(c => c === category)));
    });
  }

  getCategoryGraph(): Promise<NetworkEdge[]> {
    return new Promise<NetworkEdge[]>((resolve, reject) => {
      if (this.categoryGraph) {
        resolve(this.categoryGraph);
      }
      this.http.get<NetworkEdge[]>(`${this.backendService.url}/network/graph/category`).subscribe(
        (edges) => {
          this.categoryGraph = edges;
          resolve(edges);
        },
        reject
      );
    });
  }

  getCategoryGraphForCategory(category: string): Promise<NetworkEdge[]> {
    return new Promise<NetworkEdge[]>((resolve, reject) => {
      this.http.get<NetworkEdge[]>(`${this.backendService.url}/network/graph/category?category=${category}`).subscribe(
        (edges) => {
          resolve(edges);
        },
        reject
      );
    });
  }

}
