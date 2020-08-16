import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  url = environment.backendUrl;

  constructor() {}

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    const userToken = localStorage.getItem('userToken');
    if (req.url.indexOf(this.url) > -1 && userToken) {
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
