import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  title: string;
  forename: string;
  surname: string;
  email: string;
  password: string;
  institution: string;
  city: string;
  researchArea: string;

  constructor() { }

  ngOnInit(): void {
  }

}
