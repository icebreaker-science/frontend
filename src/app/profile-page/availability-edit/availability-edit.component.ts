import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Availability} from '../../_types/Availability';
import {BackendService} from '../../backend.service';
import {HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-availability-edit',
  templateUrl: './availability-edit.component.html',
  styleUrls: ['./availability-edit.component.scss']
})
export class AvailabilityEditComponent implements OnInit {
  @Input() availability: Availability;
  @Output() hideEdit: EventEmitter<void> = new EventEmitter<void>();
  @Output() editMsg: EventEmitter<void> = new EventEmitter<void>();
  @Input() infoMessage: string;

  editError = '';

  constructor(private backendService: BackendService,
  ) {
  }

  ngOnInit(): void {
  }

  close(): void {
    this.hideEdit.emit();
  }

  sendEdit(): void {
    this.backendService.put(this.availability,
      '/device-availability/' + `${this.availability.id}`,
      {headers: new HttpHeaders({'Content-Type': 'application/json'})})
      .subscribe(
        () => {
          this.editMsg.emit();
        },
        (error) => {
          this.editError = error.error.message;
          console.error(error);
        }
      );
  }

}
