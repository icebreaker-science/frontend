import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  wrongCredentials: boolean;

  constructor(
    private accountService: AccountService,
    private router: Router,
  ) {
    this.wrongCredentials = false;
  }

  ngOnInit(): void {
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
