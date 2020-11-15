import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityEditComponent } from './availability-edit.component';

describe('AvailabilityEditComponent', () => {
  let component: AvailabilityEditComponent;
  let fixture: ComponentFixture<AvailabilityEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailabilityEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilityEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
