import { Component, OnInit, Output } from '@angular/core';
import { AccountService } from '../account.service';
import { WikiService } from '../wiki.service';
import { map, mergeMap } from 'rxjs/operators';
import { PaginationInstance } from 'ngx-pagination';
import { UserProfile } from '../_types/UserProfile';
import { Availability } from '../_types/Availability';
import { forkJoin } from 'rxjs';
import { WikiPage } from '../_types/WikiPage';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  @Output() infoMessage: string;
  profile: UserProfile;
  deviceAndAvailability$: Array<{
    availability: Availability,
    device: WikiPage,
  }>;
  editForm = false;
  editAvailability: Availability;
  deleteForm = false;
  deleteAvailability;
  // timeout for closing the window
  private infoMessageTimeOut = 1500;

  public config: PaginationInstance = {
    id: 'device_pagination',
    itemsPerPage: 6,
    currentPage: 1
  };
  public filter = '';

  constructor(
    private accountService: AccountService,
    private wikiService: WikiService,
  ) {
  }

  ngOnInit(): void {
    this.setModalClosed();
    this.infoMessage = '';
    const userId = this.accountService.getUserId();
    this.accountService.getUserProfile().subscribe((profile) => {
        this.profile = profile;
      },
      error => console.error(error));
    this.wikiService.getDeviceAvailability({ownerId: userId})
      .pipe(mergeMap((availabilities: Availability[]) => {
        return forkJoin(...availabilities.map(a => this.wikiService.getWikiPage(a.deviceId)
          .pipe(map((wikiPage: WikiPage) => ({
            availability: a,
            device: wikiPage
          })))));
      }))
      .subscribe(availabilities => {
        this.deviceAndAvailability$ = availabilities;
      });

  }

  titleDotCheck(title) {
    if (title && title.indexOf('.') !== -1) {
      return title[0].toUpperCase() +
        title.slice(1);
    } else if (title) {
      return title[0].toUpperCase() +
        title.slice(1) + '.';
    } else {
      return ' ';
    }
  }

  onPageChange(nmbr): void {
    this.config.currentPage = nmbr;
  }

  onFilterChange(): void {
    this.config.currentPage = 1;
  }

  setModalOpened(): void {
    document.querySelector('body').style.overflow = 'hidden';
  }

  setModalClosed(): void {
    document.querySelector('body').style.overflow = 'auto';
  }

  // Edit form operations
  openEditForm(availability): void {
    this.setModalOpened();
    this.editAvailability = availability;
    this.editForm = true;
  }

  sendEditForm(): void {
    setTimeout(() => {
      this.editForm = false;
      this.ngOnInit();
    }, this.infoMessageTimeOut);
    this.infoMessage = 'Device availability information has been changed!';
  }

  closeEditForm(): void {
    this.setModalClosed();
    this.editForm = false;
  }

  // Delete form operations
  openDeleteForm(availability): void {
    this.setModalOpened();
    this.deleteAvailability = availability;
    this.deleteForm = true;
  }

  closeDeleteForm(): void {
    this.setModalClosed();
    this.deleteForm = false;
  }

  sendDeleteForm(): void {
    setTimeout(() => {
      this.deleteForm = false;
      this.ngOnInit();
    }, this.infoMessageTimeOut);
    this.infoMessage = 'Device availability information has been deleted!';
  }
}
