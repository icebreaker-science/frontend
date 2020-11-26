import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  error: string;
  password: string;
  cpassword: string;
  token: string;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.error = '';
    this.password = '';
    this.cpassword = '';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params.token;
    });
  }

  reset(): void {
    const userData = {
      password: this.password,
      token: this.token,
    };
    this.accountService.resetPassword(userData)
      .subscribe(
        () => this.router.navigateByUrl('/login?pwChanged=true'),
        (error) => this.error = error.error.error
      );
  }
}
