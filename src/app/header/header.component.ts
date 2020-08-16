import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userName: string;

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {
    this.userName = this.accountService.getUsername();
  }

  ngOnInit(): void {
    this.accountService.getLoggedInName.subscribe(name => this.userName = name);
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
