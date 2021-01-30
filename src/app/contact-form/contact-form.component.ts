import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Availability } from '../_types/Availability';
import { BackendService } from '../backend.service';
import {HttpHeaders} from '@angular/common/http';
import {AccountService} from '../account.service';
import { PublicUserProfile } from '../_types/PublicUserProfile';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {

  @Input() availability: {
    availability: Availability,
    profile: PublicUserProfile,
  };
  @Output() hide: EventEmitter<void> = new EventEmitter<void>();
  @Output() msgSent: EventEmitter<void> = new EventEmitter<void>();

  requestData = {
    name: '',
    email: '',
    message: '',
    captcha: '',
  };
  error = '';

  constructor(
    public accountService: AccountService,
    private backendService: BackendService,
  ) { }

  ngOnInit(): void {
  }

  close(): void {
    this.hide.emit();
  }

  send(contactForm): void {
    this.backendService.post(
      this.requestData,
      `/device-availability/${this.availability.availability.id}/contact`,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
      .subscribe(
        () => {
          contactForm.form.reset();
          this.msgSent.emit();
        },
        (err) => {
          this.error = err.error.message;
          this.requestData.captcha = '';
        },
      );
  }

  // Captcha error
  onCaptchaError(error: any) {
    this.error = 'Error while validating captcha.';
  }
}
