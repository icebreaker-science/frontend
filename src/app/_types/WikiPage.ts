export interface WikiPage {
  id?: number;
  type: string;
  title: string;
  description: string;
  references?: string;
  image?: File;
}


export function copyWikiPage(wikiPage: WikiPage) {
  return Object.assign({}, wikiPage);
}

export function wikiPageToFormData(wikiPage: WikiPage) {
  const data: FormData = new FormData();
  data.append('description', wikiPage.description);
  data.append('title', wikiPage.title);
  data.append('type', wikiPage.type);
  data.append('references', wikiPage.references);
  data.append('image', wikiPage.image);
  return data;
}
