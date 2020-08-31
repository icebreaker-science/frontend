import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService } from './backend.service';
import { NetworkEdge } from './_types/NetworkEdge';
import { NetworkNode } from './_types/NetworkNode';
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
  private nodes: NetworkNode[];

  constructor(
    private http: HttpClient,
    private backendService: BackendService,
  ) {
  }


  getNodes(): Promise<NetworkNode[]> {
    return new Promise<NetworkNode[]>((resolve, reject) => {
      if (this.nodes) {
        resolve(this.nodes);
        return;
      }
      this.http.get<NetworkNode[]>(`${this.backendService.url}/network/node`).subscribe(
        (nodes) => {
          this.nodes = nodes;
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

}
