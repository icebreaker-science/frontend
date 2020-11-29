import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  submitted: boolean;
  email: string;
  captcha: string;
  error: string;

  constructor(
    private accountService: AccountService
  ) {
    this.submitted = false;
    this.captcha = '';
    this.error = '';
  }

  ngOnInit(): void {
  }

  forgot(): void {
    const userData = {
      email: this.email,
      captcha: this.captcha,
    };
    this.accountService.forgotPassword(userData)
      .subscribe(
        () => this.submitted = true,
        (error) => this.error = error.error.error
      );
  }

  // Captcha error
  onCaptchaError(error: any) {
    this.error = 'Error while validating captcha.';
  }
}
