import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private backendService: BackendService) { }

  register(userData) {
    return this.backendService.post(userData, '/account/register');
  }

}

