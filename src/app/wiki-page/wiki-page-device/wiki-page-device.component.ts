import {Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core';
import { WikiPage } from 'src/app/_types/WikiPage';
import { Availability } from 'src/app/_types/Availability';
import { WikiService } from 'src/app/wiki.service';

@Component({
  selector: 'app-wiki-page-device',
  templateUrl: './wiki-page-device.component.html',
  styleUrls: ['./wiki-page-device.component.scss']
})
export class WikiPageDeviceComponent implements OnInit {
  @Input() wikiPage: WikiPage;
  @Output() msgSent: EventEmitter<string> = new EventEmitter<string>();
  deviceAvailabilities: Availability[];
  contactForm = false;
  contactAvailability: Availability;

  constructor(
    private wikiService: WikiService
  ) {
    this.contactAvailability = {
      deviceId: 0,
      comment: '',
      germanPostalCode: '',
      institution: '',
      researchGroup: '',
    };
  }

  ngOnInit(): void {
    this.wikiService.getDeviceAvailability({
      deviceId: this.wikiPage.id
    }).subscribe(
      (availabilities) => this.deviceAvailabilities = availabilities,
      (err) => console.error(err)
    );
  }

  openContactForm(availability): void {
    this.contactAvailability = availability;
    this.contactForm = true;
  }

  closeContactForm(): void {
    this.contactForm = false;
  }

  sendContactForm(): void {
    this.contactForm = false;
    this.msgSent.emit('Message has been sent to device owner!');
  }
}
