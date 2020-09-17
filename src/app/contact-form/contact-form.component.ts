import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Availability } from '../_types/Availability';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {

  @Input() avail: Availability;
  @Output() hide: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

}
