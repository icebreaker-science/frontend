import {Component, HostListener, OnInit} from '@angular/core';
import { AccountService } from '../account.service';
import { NavigationStart, Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  DEVELOPMENT_MODE = false;
  userName: string;
  navOpen = false;

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {
    this.userName = this.accountService.getUsername();
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationStart) { this.closeNav(); }
    });
  }

  ngOnInit(): void {
    this.accountService.getLoggedInName.subscribe(name => this.userName = name);
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

  toggleNav() {
    this.navOpen = !this.navOpen;
  }

  closeNav() {
    this.navOpen = false;
  }
}
