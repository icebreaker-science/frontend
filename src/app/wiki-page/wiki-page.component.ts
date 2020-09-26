import { Component, OnInit } from '@angular/core';
import { WikiPage } from '../_types/WikiPage';
import { WikiService } from '../wiki.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wiki-page',
  templateUrl: './wiki-page.component.html',
  styleUrls: ['./wiki-page.component.scss']
})
export class WikiPageComponent implements OnInit {
  wikiPage: WikiPage;

  constructor(
    private route: ActivatedRoute,
    private wikiService: WikiService
  ) {}

  ngOnInit(): void {
    this.getWikiPage();
  }

  getWikiPage() {
    this.route.params.subscribe(params => {
      const wikiID = params.id;
      this.wikiService.getWikiPage(wikiID).subscribe(
        (wikiPage: WikiPage) => {
          this.wikiPage = wikiPage;
        },
        (err) => console.error(err) // TODO: display not found
      );
    });
  }

}
