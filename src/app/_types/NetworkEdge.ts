export interface NetworkEdge {
  id?: string; // The edge is only for the frontend application and not known by the backend. It has the form "<node1>@@@<node2>"
  node1: string;
  node2: string;
  weight: number;
  normalizedWeight: number;
  references: string;
}


export function copyWikiPage(edge: NetworkEdge) {
  return Object.assign({}, edge);
}
