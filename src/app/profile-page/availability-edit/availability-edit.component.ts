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

  reqData = {
    comment: '',
    deviceId: 0,
    germanPostalCode: '',
    institution: '',
    researchGroup: '',
  };
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
    this.reqData.deviceId = this.availability.id;
    this.backendService.put(this.reqData,
      '/device-availability/' + `${this.availability.id}`,
      {headers: new HttpHeaders({'Content-Type': 'application/json'})})
      .subscribe(
        () => {
          this.reqData = {
            deviceId: 0,
            comment: '',
            germanPostalCode: '',
            institution: '',
            researchGroup: '',
          };
          this.editMsg.emit();
        },
        (error) => {
          this.editError = error.error.message;
          console.error(error);
        }
      );
  }

}
