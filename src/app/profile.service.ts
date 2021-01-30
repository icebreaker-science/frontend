import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService } from './backend.service';
import { Observable } from 'rxjs';
import { PublicUserProfile } from './_types/PublicUserProfile';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private http: HttpClient,
    private backendService: BackendService,
  ) {
  }


  getProfile(id): Observable<PublicUserProfile> {
    return this.http.get<PublicUserProfile>(
      `${this.backendService.url}/profile/${id}`,
      {}
    );
  }
}
