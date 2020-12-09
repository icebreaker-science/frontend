import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  wrongCredentials: boolean;
  newRegistered: boolean;
  notLoggedIn: boolean;
  validated: boolean;
  pwChanged: boolean;
  tokenInvalidated: boolean;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.wrongCredentials = false;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.newRegistered = params.registered;
      this.notLoggedIn = params.notLoggedIn;
      this.validated = params.validated;
      this.pwChanged = params.pwChanged;
      this.tokenInvalidated = params.tokenInvalidated;
    });
  }

  login() {
    const userData = {
      email: this.email,
      password: this.password,
    };

    this.accountService.login(userData)
      .subscribe(
        () => this.router.navigateByUrl('/'),
        () => this.wrongCredentials = true,
      );
  }
}
