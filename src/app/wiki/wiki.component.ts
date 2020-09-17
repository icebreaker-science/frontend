import { Component, OnInit } from '@angular/core';
import {Availability} from '../_types/Availability';

@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.component.html',
  styleUrls: ['./wiki.component.scss']
})
export class WikiComponent implements OnInit {

  contactForm = false;
  contactAvail: Availability;
  dummyAvail: Availability;

  constructor() {
    this.dummyAvail = {
      deviceId: 1,
      comment: 'This is device is super awesome!', /* ? */
      germanPostalCode: '22523',
      institution: 'Super fun institue',
      researchGroup: 'Group of Research', /* ? */
    };
  }

  ngOnInit(): void {
  }

  openContactFormDummy(avail: Availability): void {
    this.contactAvail = avail;
    this.contactForm = true;
  }

  closeContactFormDummy(): void {
    this.contactForm = false;
  }

}
