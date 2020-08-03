import { Component, OnInit } from '@angular/core';
import { User } from '../_types/User';
import { AccountService} from '../account.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  user: User;

  constructor(
    private accountService: AccountService,
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
  }

  ngOnInit(): void {
  }

  newUser() {
    this.accountService.register(this.user)
      .subscribe(
        response => console.log('Success!', response),
        error => console.error('Error!', error)
      );
  }
}
