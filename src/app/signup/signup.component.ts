import { Component, OnInit } from '@angular/core';
import { User } from '../_types/User';
import { AccountService} from '../account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  user: User;
  wrongCredentials: boolean;

  constructor(
    private accountService: AccountService,
    private router: Router,
  ) {
    this.user = {
      account: {
        email: '',
        password: '',
      },
      profile: {
        title: '',
        forename: '',
        surname: '',
        institution: '',
        city: '',
        researchArea: '',
      }
    };
    this.wrongCredentials = false;
  }

  ngOnInit(): void {
  }

  newUser() {
    this.accountService.register(this.user)
      .subscribe(
        () => this.router.navigateByUrl('/login'),
        () => this.wrongCredentials = true,
      );
  }
}
