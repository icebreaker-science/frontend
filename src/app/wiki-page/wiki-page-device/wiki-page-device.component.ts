import {Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core';
import { WikiPage } from 'src/app/_types/WikiPage';
import { Availability } from 'src/app/_types/Availability';
import { WikiService } from 'src/app/wiki.service';
import {AccountService} from '../../account.service';

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
  addAvailability: Availability ;
  addForm = false;
  infoMessage = '';
  infoMessageTimeOut = 2000;
  isLoggedIn: boolean;

  constructor(
    private wikiService: WikiService,
    private accountService: AccountService
  ) {
    this.isLoggedIn = accountService.isLoginValid();
    this.contactAvailability = {
      deviceId: 0,
      comment: '',
      germanPostalCode: '',
      institution: '',
      researchGroup: '',
    };
  }

  ngOnInit(): void {
    this.infoMessage = '';
    this.addAvailability = {
      comment: '',
      deviceId: 0,
      germanPostalCode: '',
      institution: '',
      researchGroup: '',
    };
    this.wikiService.getDeviceAvailability({
      deviceId: this.wikiPage.id
    }).subscribe(
      (availabilities) => this.deviceAvailabilities = availabilities,
      (err) => console.error(err)
    );
  }
  setModalOpened(): void {
     document.querySelector('body').style.overflow = 'hidden';
    }
  setModalClosed(): void{
    document.querySelector('body').style.overflow = 'auto';
  }
  openContactForm(availability): void {
    this.setModalOpened();
    this.contactAvailability = availability;
    this.contactForm = true;
  }

  closeContactForm(): void {
    this.setModalClosed();
    this.contactForm = false;
  }

  sendContactForm(): void {
    this.setModalClosed();
    this.contactForm = false;
    this.msgSent.emit('Message has been sent to device owner!');
  }

  openAddForm(deviceId): void {
    this.setModalOpened();
    this.addAvailability.deviceId = deviceId;
    this.addForm = true;
  }

  closeAddForm(): void {
    this.setModalClosed();
    this.addForm = false;
  }

  sendAddForm(): void {
    this.setModalClosed();
    this.addForm = false;
    this.infoMessage = 'Device availability has been added';
    setTimeout(() => {
      this.ngOnInit();
    }, this.infoMessageTimeOut);
  }
}
