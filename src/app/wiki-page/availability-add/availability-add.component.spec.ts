import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityAddComponent } from './availability-add.component';

describe('AvailabilityAddComponent', () => {
  let component: AvailabilityAddComponent;
  let fixture: ComponentFixture<AvailabilityAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailabilityAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilityAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
