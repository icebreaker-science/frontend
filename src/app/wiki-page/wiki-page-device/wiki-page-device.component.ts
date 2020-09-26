import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { WikiPage } from 'src/app/_types/WikiPage';
import { Availability } from 'src/app/_types/Availability';
import { WikiService } from 'src/app/wiki.service';

@Component({
  selector: 'app-wiki-page-device',
  templateUrl: './wiki-page-device.component.html',
  styleUrls: ['./wiki-page-device.component.scss']
})
export class WikiPageDeviceComponent implements OnInit {
  @Input()
  wikiPage: WikiPage;
  deviceAvailabilities: Availability[];

  constructor(
    private wikiService: WikiService
  ) { }

  ngOnInit(): void {
    this.wikiService.getDeviceAvailability({
      deviceId: this.wikiPage.id
    }).subscribe(
      (availabilities) => this.deviceAvailabilities = availabilities,
      (err) => console.error(err)
    );
  }

  openContactForm(availability) {
    console.log(availability);
  }
}
