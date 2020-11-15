import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityDeleteComponent } from './availability-delete.component';

describe('AvailabilityDeleteComponent', () => {
  let component: AvailabilityDeleteComponent;
  let fixture: ComponentFixture<AvailabilityDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailabilityDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilityDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
