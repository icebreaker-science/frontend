import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Availability } from '../_types/Availability';
import { BackendService } from '../backend.service';
import {HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {

  @Input() availability: Availability;
  @Output() hide: EventEmitter<void> = new EventEmitter<void>();

  requestData = {
    name: '',
    email: '',
    message: '',
  };

  constructor(
    private backendService: BackendService,
  ) { }

  ngOnInit(): void {
  }

  close(): void {
    this.hide.emit();
  }

  send(): void {
    this.backendService.post(
      this.requestData,
      `/device-availability/${this.availability.deviceId}/contact`,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
      .subscribe(
        () => this.hide.emit(),
      );
  }
}
