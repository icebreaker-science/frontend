import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiPageDeviceComponent } from './wiki-page-device.component';

describe('WikiPageDeviceComponent', () => {
  let component: WikiPageDeviceComponent;
  let fixture: ComponentFixture<WikiPageDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WikiPageDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WikiPageDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
