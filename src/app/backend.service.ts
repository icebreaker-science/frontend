import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  url = environment.backendUrl;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  post(data, urlOption) {
    return this.http.post<any>(`${this.url}${urlOption}`, data, this.httpOptions);
  }
}
