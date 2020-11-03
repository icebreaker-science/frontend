import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  url = environment.backendUrl;

  constructor(private http: HttpClient) { }

  post(data, urlOption, options) {
    return this.http.post<any>(`${this.url}${urlOption}`, data, options);
  }

  get<T>(urlOption, options?): Observable<T>;
  get<T>(urlOption, options) {
    return this.http.get<any>(`${this.url}${urlOption}`, options);
  }
}
