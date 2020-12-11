import { Component, OnInit } from '@angular/core';
import { WikiService } from '../wiki.service';
import { WikiPage } from '../_types/WikiPage';
import { Router } from '@angular/router';
import {Availability} from '../_types/Availability';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-device-creation',
  templateUrl: './device-creation.component.html',
  styleUrls: ['./device-creation.component.scss']
})
export class DeviceCreationComponent implements OnInit {
  imageError;
  fileSizeLimit = environment.maxImageSizeKB;
  fileTypesAllowed = environment.allowedImageTypes;
  error = false;
  device: WikiPage = {
    type: 'device',
    title: '',
    description: '',
    references: '',
  };

  addAvailability = false;
  availability: Availability = {
    deviceId: null,
    comment: '',
    germanPostalCode: '',
    institution: '',
    researchGroup: '',
    disabled: false,
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
       if (this.addAvailability) {
         await this.wikiService.sendDeviceData(this.availability);
       }
       console.log(`New device created, ID=${ id }.`);
       await this.router.navigateByUrl('/device-search');
     } catch (e) {
       this.error = true;
       console.error('Something went wrong!', e);
     }
  }

  handleFileInput(files: FileList) {
    const file = files[0];
    if (file.size > this.fileSizeLimit * 1024) {
      this.device.image = null;
      this.imageError = 'Image too big';
    } else {
      this.imageError = null;
    }
  }
}
