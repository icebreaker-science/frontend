import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AccountService } from './account.service';
import { tap } from 'rxjs/operators';
import { Router} from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  url = environment.backendUrl;

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    const userToken = localStorage.getItem('userToken');
    if (req.url.indexOf(this.url) > -1 && userToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization',
          `Bearer ${userToken}`)
      });

      return next.handle(cloned).pipe( tap(() => {},
            // check Token Validity
            (err: any) => {
              if (err instanceof HttpErrorResponse) {
                if (err.status !== 401) {
                  return;
                }
                this.accountService.logout();
                this.router.navigateByUrl('/login?notLoggedIn=true');
              }
            }));
    }
    else {
      return next.handle(req);
    }
  }
}
