import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { WikiService } from '../wiki.service';
import {WikiPage} from '../_types/WikiPage';
import { PaginationInstance } from 'ngx-pagination';


@Component({
  selector: 'app-device-search',
  templateUrl: './device-search.component.html',
  styleUrls: ['./device-search.component.scss']
})
export class DeviceSearchComponent implements OnInit {

  devices$ = this.wikiService.wikiPages$.pipe(
    map(wikiPages => wikiPages.filter(w => w.type === 'device'))
  );
  public config: PaginationInstance = {
    id: 'device_pagination',
    itemsPerPage: 12,
    currentPage: 1
  };

  constructor(
    private wikiService: WikiService,
  ) { }


  ngOnInit(): void {
    this.wikiService.loadDevices();
  }

  onPageChange(nmbr) {
    this.config.currentPage = nmbr;
  }

}
