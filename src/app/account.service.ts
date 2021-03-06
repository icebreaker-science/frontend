import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import {Observable, Subject, throwError} from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { UserProfile } from './_types/UserProfile';


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

  validateAccount(key) {
    return this.backendService.post(
      {},
      `/account/validate-email?key=${key}`,
      {}
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
          this.setUserId(res);
          this.setUsername(res);
          observer.next(res);
          },
        err => observer.error(err),
        );
    });
  }

  getUserProfile() {
    return this.backendService.get<UserProfile>(
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
  setUserId(res){
    const userId = res.accountId;
    localStorage.setItem('userId', userId);
  }
  getUserId(){
    const userId = localStorage.getItem('userId');
    return userId ? userId : {};
  }
  setSession(token) {
    const decoded = this.parseJwt(token);
    localStorage.setItem('userToken', token);
    localStorage.setItem('expiresAt', decoded.exp);
  }

  /* https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library/38552302#38552302 */
  parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('userToken');
    localStorage.removeItem('expiresAt');
    this.getLoggedInName.next('');
  }

  isLoginValid() {
    return (
      localStorage.getItem('userToken') &&
      localStorage.getItem('expiresAt') &&
      Date.now() / 1000 < parseInt(localStorage.getItem('expiresAt'), 10)
    );
  }

  forgotPassword(userData) {
    return this.backendService.put(
      userData,
      '/account/forgot-password',
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  resetPassword(userData) {
    return this.backendService.post(
      userData,
      '/account/reset-password',
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

}

