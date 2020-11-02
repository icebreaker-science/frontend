import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-email-validation',
  templateUrl: './email-validation.component.html',
  styleUrls: ['./email-validation.component.scss']
})
export class EmailValidationComponent implements OnInit {

  ServerError: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      switchMap(
        params => this.accountService.validateAccount(params.key)
      )
    ).subscribe(
      () => this.router.navigateByUrl('/login?validated=true'),
      err => this.ServerError = err.error.message
    );
  }
}
