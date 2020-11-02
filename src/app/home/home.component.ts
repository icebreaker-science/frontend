import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private accountService: AccountService,
  ) { }

  ngOnInit(): void {
    this.accountService.getUserProfile().subscribe((profile) => {
    });
  }

}
