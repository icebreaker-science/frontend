import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceCreationComponent } from './device-creation.component';

describe('DeviceCreationComponent', () => {
  let component: DeviceCreationComponent;
  let fixture: ComponentFixture<DeviceCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
