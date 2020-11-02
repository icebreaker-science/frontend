import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { copyWikiPage, WikiPage, wikiPageToFormData } from './_types/WikiPage';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Availability} from './_types/Availability';


@Injectable({
  providedIn: 'root'
})
export class WikiService {

  private wikiPagesStore = new Map<number, WikiPage>(); // id -> WikiPage

  private _wikiPages$ = new BehaviorSubject<WikiPage[]>([]);

  /**
   * This observable covers all wiki pages that were loaded but not necessary all existing wiki pages.
   */
  readonly wikiPages$ = this._wikiPages$.asObservable();


  constructor(
    private http: HttpClient,
    private backendService: BackendService,
  ) {
  }

  getDeviceAvailability(opts): Observable<Availability[]> {
    let params = new HttpParams();
    if (opts.deviceId) {
      params = params.append('device', opts.deviceId);
    }
    if (opts.ownerId) {
      params = params.append('ownerId', opts.ownerId);
    }

    return this.http.get<Availability[]>(
      `${this.backendService.url}/device-availability/`,
      { params }
    );
  }

  getWikiPage(id): Observable<WikiPage> {
    return this.http.get<WikiPage>(
      `${this.backendService.url}/wiki/${id}`,
      {}
    );
  }

  loadDevices(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.get<WikiPage[]>(`${this.backendService.url}/wiki?type=device`).subscribe(
        (wikiPages) => {
          for (const w of wikiPages) {
            this.wikiPagesStore.set(w.id, w);
          }
          this.notifyForWikiPages();
          resolve();
        },
        reject
      );
    });
  }


  /**
   * @returns The ID of the created wiki page
   */
  createWikiPage(device: WikiPage): Promise<number> {
    return new Promise<number>(((resolve, reject) => {
        this.http.post<number>(`${this.backendService.url}/wiki`, wikiPageToFormData(device))
          .subscribe(
          (id) => {
            const copy = copyWikiPage(device);
            copy.id = id;
            this.wikiPagesStore.set(id, copy);
            this.notifyForWikiPages();
            resolve(id);
          },
          reject
        );
      })
    );
  }

  sendDeviceData(device: Availability): Promise<number> {
    return new Promise<number>(((resolve, reject) => {
        this.http.post<number>(`${this.backendService.url}/device-availability/`, JSON.stringify(device), {
          headers: new HttpHeaders({'Content-Type': 'application/json'})
        }).subscribe(
          (res) => resolve(res),
          reject,
        );
      })
    );
  }


  private notifyForWikiPages() {
    this._wikiPages$.next(Array.from(this.wikiPagesStore.values()).map(copyWikiPage));
  }
}
