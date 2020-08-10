import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private backendService: BackendService) { }

  register(userData) {
    return this.backendService.post(
      userData,
      '/account/register',
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
      );
  }

  login(userData) {
    return new Observable((observer) => {
      const response = this.backendService.post(
        userData,
        '/account/login',
        {headers: new HttpHeaders({'Content-Type': 'application/json'}), responseType: 'text'}
      );
      response.subscribe(
        res => {
          this.setSession(res);
          observer.next(res);
        },
        err => {
          observer.error(err);
        },
      );
    });
  }

  setSession(token) {
    localStorage.setItem('userToken', token);
    localStorage.setItem('expiresAt', (Date.now() + 259200000).toString());
  }

  logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('expiresAt');
  }

  isLoginValid() {
    return Date.now() < parseInt(localStorage.getItem('expiresAt'), 10);
  }

}

