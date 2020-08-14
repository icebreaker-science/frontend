export interface WikiPage {
  id?: number;
  type: string;
  title: string;
  description: string;
  references?: string;
}


export function copyWikiPage(wikiPage: WikiPage) {
  return Object.assign({}, wikiPage);
}
