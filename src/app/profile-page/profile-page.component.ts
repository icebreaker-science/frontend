import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { AccountService } from '../account.service';
import { WikiService } from "../wiki.service";
import {map} from "rxjs/operators";
import {PaginationInstance} from "ngx-pagination";

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  availabilities$;
  public config: PaginationInstance = {
    id: 'device_pagination',
    itemsPerPage: 12,
    currentPage: 1
  };
  public filter = '';

  constructor(
    private accountService : AccountService,
    private wikiService : WikiService,
  ) {
  }

  ngOnInit(): void {
    const userId = this.accountService.getUserId();
    this.wikiService.getDeviceAvailability({"ownerId": userId}).subscribe(availabilities => this.availabilities$ = availabilities);
  }
  getCommentText(comment){
    if(comment && comment.length > 100){
       return comment.slice(0,100) + '...' ;
    }
    else if(comment){
      return comment;
    }
    else {
      ' ' ;
    };
  }
  onPageChange(nmbr): void {
    this.config.currentPage = nmbr;
  }

  onFilterChange(): void {
    this.config.currentPage = 1;
  }
}
