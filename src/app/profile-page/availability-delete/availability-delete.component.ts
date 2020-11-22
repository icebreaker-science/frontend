import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Availability} from '../../_types/Availability';
import {BackendService} from '../../backend.service';
import {HttpHeaders} from '@angular/common/http';
import {ProfilePageComponent} from '../profile-page.component';

@Component({
  selector: 'app-availability-delete',
  templateUrl: './availability-delete.component.html',
  styleUrls: ['./availability-delete.component.scss']
})
export class AvailabilityDeleteComponent implements OnInit {
  @Input() availability: Availability;
  @Output() hideDelete: EventEmitter<void> = new EventEmitter<void>();
  @Output() deleteMsg: EventEmitter<void> = new EventEmitter<void>();
  @Input() infoMessage: string;
  deleteError = '';


  constructor(private backendService: BackendService,
  ) {
  }

  ngOnInit(): void {
  }

  close(): void {
    this.hideDelete.emit();
  }


  sendDelete(): void {
    this.backendService.delete('/device-availability/' + `${this.availability.id}`,
      {headers: new HttpHeaders({'Content-Type': 'application/json'})})
      .subscribe(
        () => {
          this.deleteMsg.emit();
        },
        (error) => {
          this.deleteError = error.error.message;
          console.error(error);
        }
      );
  }

}
