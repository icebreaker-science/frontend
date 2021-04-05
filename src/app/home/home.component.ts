import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  team = [
    {
      name: 'Ali asghar Maleki',
      image: 'empty.jpg',
      short: 'TU Kaiserslautern - Student (Computer Science)',
    },
    {
      name: 'Annette Bieniusa',
      image: 'annette.jpg',
      short: 'TU Kaiserslautern - Academic Counsel (Computer Science)',
    },
    {
      name: 'Benjamin Wolf',
      image: 'benjamin.jpg',
      short: 'University of Hamburg - Student (Computer Science)',
    },
    {
      name: 'Chaoran Chen',
      image: 'chaoran.jpg',
      short: 'ETH Zurich - PhD Student (Computational Biology)',
    },
    {
      name: 'Daniel Jenet',
      image: 'empty.jpg',
      short: 'TU Kaiserslautern - Student (Computer Science)',
    },
    {
      name: 'Elisabeth von der Esch',
      image: 'elisabeth.jpg',
      short: 'GEOMAR - Helmholtz-Zentrum für Ozeanforschung Kiel - PostDoc (Chemistry)',
    },
    {
      name: 'Flora Siegele',
      image: 'empty.jpg',
      short: 'TU Munich - Student (Chemistry)',
    },
    {
      name: 'Franziska Eyo',
      image: 'franziska.jpg',
      short: 'University of Rostock - Student (Medical Science)',
    },
    {
      name: 'Julia Klüpfel',
      image: 'julia.jpg',
      short: 'TU Munich - PhD Student (Chemistry)',
    },
    {
      name: 'Lukas Vordemann',
      image: 'lukas.jpg',
      short: 'TU Munich - Student (Computer Science)',
    },
    {
      name: 'Michael Youssef',
      image: 'empty.jpg',
      short: 'TU Kaiserslautern - Student (Computer Science)',
    },
    {
      name: 'Sofia Beliakova',
      image: 'sofia.jpg',
      short: 'TU Munich - Student (Chemistry)',
    },
  ];


  // Thanks https://stackoverflow.com/a/12646864/8376759
  static shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }


  constructor(
    private accountService: AccountService,
  ) {
    HomeComponent.shuffleArray(this.team);
  }


  ngOnInit(): void {
    this.accountService.getUserProfile().subscribe((profile) => {
    });
  }
}
