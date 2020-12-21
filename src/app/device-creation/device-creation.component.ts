import { Component, OnInit } from '@angular/core';
import { WikiService } from '../wiki.service';
import { WikiPage } from '../_types/WikiPage';
import { Router } from '@angular/router';
import {Availability} from '../_types/Availability';
import { environment } from '../../environments/environment';
import { NetworkService } from '../network.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';


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
    networkKeywords: [],
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

  existingNetworkKeywords: Array<string>;


  constructor(
    private router: Router,
    private wikiService: WikiService,
    private networkService: NetworkService,
  ) { }


  ngOnInit(): void {
    this.init();
  }


  private async init() {
    this.existingNetworkKeywords = (await this.networkService.getNodes()).map(node => node.name);
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


  searchKeyword = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.existingNetworkKeywords.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  }


  async addKeyword($event: NgbTypeaheadSelectItemEvent<string>, input) {
    $event.preventDefault();
    input.value = '';
    this.device.networkKeywords.push($event.item);
  }


  removeKeyword(keyword: string) {
    this.device.networkKeywords = this.device.networkKeywords.filter(k => k !== keyword);
  }
}
