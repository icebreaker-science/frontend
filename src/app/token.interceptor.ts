import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization',
          `Bearer ${userToken}`)
      });

      return next.handle(cloned);
    }
    else {
      return next.handle(req);
    }
  }
}
