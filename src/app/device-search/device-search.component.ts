import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { WikiService } from '../wiki.service';
import { Observable } from 'rxjs';
import { WikiPage } from '../_types/WikiPage';


@Component({
  selector: 'app-device-search',
  templateUrl: './device-search.component.html',
  styleUrls: ['./device-search.component.scss']
})
export class DeviceSearchComponent implements OnInit {

  devices$ = this.wikiService.wikiPages$.pipe(
    map(wikiPages => wikiPages.filter(w => w.type === 'device'))
  );


  constructor(
    private wikiService: WikiService,
  ) { }


  ngOnInit(): void {
    this.wikiService.loadDevices();
  }

}
