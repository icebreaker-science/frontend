export interface KeywordNode {
  id: number;
  name: string;
  weight: number;
  categories: string[];
}

export interface CategoryNode {
  id: number;
  name: string;
  weight: number;
  rank: number;
}

export type NetworkNode = KeywordNode | CategoryNode;

export function copyWikiPage(node: KeywordNode) {
  return Object.assign({}, node);
}
