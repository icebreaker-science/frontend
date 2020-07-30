import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  url = 'http://localhost:9090'; /* /api */
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  register(userData) {
    return this.http.post<any>(`${this.url}/account/register`, userData, this.httpOptions);
  }

}

