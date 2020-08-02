import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  url = /* 'http://localhost:9090'; */ '/api';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  post(data, urlOption) {
    return this.http.post<any>(`${this.url}${urlOption}`, data, this.httpOptions);
  }
}
