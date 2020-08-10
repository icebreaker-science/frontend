import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  url = environment.backendUrl;

  constructor(private http: HttpClient) { }

  post(data, urlOption, options) {
    return this.http.post<any>(`${this.url}${urlOption}`, data, options);
  }
}
