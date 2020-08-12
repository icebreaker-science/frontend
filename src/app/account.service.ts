import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { Observable, Subject } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  public getLoggedInName = new Subject<string>();

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
      this.backendService.post(
        userData,
        '/account/login',
        {headers: new HttpHeaders({'Content-Type': 'application/json'}), responseType: 'text'}
      ).pipe(
        map(res => this.setSession(res)),
        switchMap(
          () => this.getUserProfile(),
        )
      ).subscribe(
        res => {
          this.setUsername(res);
          observer.next(res);
          },
        err => observer.error(err),
        );
    });
  }

  getUserProfile() {
    console.log('userprofile called');
    return this.backendService.get(
      '/account/my-profile',
      {}
    );
  }

  setUsername(res) {
    const userName = `${res.forename} ${res.surname}`;
    localStorage.setItem('username', userName);
    this.getLoggedInName.next(userName);
  }

  getUsername() {
    const userName = localStorage.getItem('username');
    return userName ? userName : '';
  }

  setSession(token) {
    localStorage.setItem('userToken', token);
    localStorage.setItem('expiresAt', (Date.now() + 259200000).toString());
  }

  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('userToken');
    localStorage.removeItem('expiresAt');
    this.getLoggedInName.next('');
  }

  isLoginValid() {
    return (
      localStorage.getItem('username') &&
      localStorage.getItem('userToken') &&
      localStorage.getItem('expiresAt') &&
      Date.now() < parseInt(localStorage.getItem('expiresAt'), 10)
    );
  }

}

