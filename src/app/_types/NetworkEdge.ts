export interface NetworkEdge {
  id?: string; // The edge is only for the frontend application and not known by the backend. It has the form "<node1>@@@<node2>"
  node1: number;
  node2: number;
  node1Name?: string;
  node2Name?: string;
  weight: number;
  normalizedWeight: number;
  references: string;
}


export function copyWikiPage(edge: NetworkEdge) {
  return Object.assign({}, edge);
}
