export interface Paper {
  icebreakerId: number;
  doi?: string;
  title?: string;
  year?: number;
}


export function copyPaper(paper: Paper) {
  return Object.assign({}, paper);
}
