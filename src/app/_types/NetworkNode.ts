export interface NetworkNode {
  name: string;
  weight: number;
}


export function copyWikiPage(node: NetworkNode) {
  return Object.assign({}, node);
}
