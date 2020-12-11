import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Availability} from '../../_types/Availability';
import {BackendService} from '../../backend.service';
import {HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-availability-add',
  templateUrl: './availability-add.component.html',
  styleUrls: ['./availability-add.component.scss']
})
export class AvailabilityAddComponent implements OnInit {
  @Input() availability: Availability;
  @Output() hideAdd: EventEmitter<void> = new EventEmitter<void>();
  @Output() addMsgSent: EventEmitter<void> = new EventEmitter<void>();
  @Input() infoMessage: string;

  addError = '';

  constructor(private backendService: BackendService,
  ) {
  }

  ngOnInit(): void {
  }

  close(): void {
    this.hideAdd.emit();
  }

  sendAdd(): void {
    this.backendService.post(this.availability,
      '/device-availability/',
      {headers: new HttpHeaders({'Content-Type': 'application/json'})})
      .subscribe(
        () => {
          this.addMsgSent.emit();
        },
        (error) => {
          this.addError = error.error.message;
          console.error(this.addError);
        }
      );
  }
}
