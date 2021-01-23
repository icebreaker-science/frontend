import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { WikiPage } from 'src/app/_types/WikiPage';
import { Availability } from 'src/app/_types/Availability';
import { WikiService } from 'src/app/wiki.service';
import { AccountService } from '../../account.service';
import { map, mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { ProfileService } from '../../profile.service';
import { PublicUserProfile } from '../../_types/PublicUserProfile';


@Component({
  selector: 'app-wiki-page-device',
  templateUrl: './wiki-page-device.component.html',
  styleUrls: ['./wiki-page-device.component.scss']
})
export class WikiPageDeviceComponent implements OnInit {
  @Input() wikiPage: WikiPage;
  @Output() msgSent: EventEmitter<string> = new EventEmitter<string>();
  deviceAvailabilities: Array<{
    availability: Availability,
    profile: PublicUserProfile,
  }>;
  contactForm = false;
  contactAvailability: {
    availability: Availability,
    profile: PublicUserProfile,
  };
  addAvailability: Availability;
  addForm = false;
  infoMessageTimeOut = 2000;
  isLoggedIn: boolean;

  constructor(
    private wikiService: WikiService,
    private accountService: AccountService,
    private profileService: ProfileService,
  ) {
    this.isLoggedIn = accountService.isLoginValid();
  }


  ngOnInit(): void {
    this.addAvailability = {
      comment: '',
      deviceId: 0,
      germanPostalCode: null,
      institution: '',
      researchGroup: '',
      disabled: false
    };
    this.wikiService.getDeviceAvailability({
      deviceId: this.wikiPage.id
    })
      .pipe(mergeMap((availabilities: Availability[]) => {
        return forkJoin(...availabilities.map(a => this.profileService.getProfile(a.accountId)
          .pipe(map((profile: PublicUserProfile) => ({
            availability: a,
            profile
          })))));
      }))
      .subscribe(
      (availabilitiesWithProfiles) => {
        this.deviceAvailabilities = availabilitiesWithProfiles;
      }
    );
  }


  setModalOpened(): void {
    document.querySelector('body').style.overflow = 'hidden';
  }


  setModalClosed(): void {
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
    this.msgSent.emit('Device availability has been added');
    setTimeout(() => {
      this.ngOnInit();
    }, this.infoMessageTimeOut);
  }
}
