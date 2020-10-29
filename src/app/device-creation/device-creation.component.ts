import { Component, OnInit } from '@angular/core';
import { WikiService } from '../wiki.service';
import { WikiPage } from '../_types/WikiPage';
import { Router } from '@angular/router';
import {Availability} from '../_types/Availability';


@Component({
  selector: 'app-device-creation',
  templateUrl: './device-creation.component.html',
  styleUrls: ['./device-creation.component.scss']
})
export class DeviceCreationComponent implements OnInit {

  error = false;
  device: WikiPage = {
    type: 'device',
    title: '',
    description: '',
    references: '',
  };
  availability: Availability = {
    deviceId: null,
    comment: '',
    germanPostalCode: '',
    institution: '',
    researchGroup: '',
  };


  constructor(
    private router: Router,
    private wikiService: WikiService,
  ) { }


  ngOnInit(): void {
  }


  async submit(): Promise<void> {
     try {
       const id = await this.wikiService.createWikiPage(this.device);
       this.availability.deviceId = id;
       await this.wikiService.sendDeviceData(this.availability);
       console.log(`New device created, ID=${ id }.`);
       await this.router.navigateByUrl('/device-search');
     } catch (e) {
       this.error = true;
       console.error('Something went wrong!', e);
     }
  }

  handleFileInput(files: FileList) {
    this.device.image = files.item(0);
  }
}
