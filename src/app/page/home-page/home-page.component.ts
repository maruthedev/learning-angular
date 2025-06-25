import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit{
  accessToken: string | null = null;

  ngOnInit(): void {
    this.accessToken = localStorage.getItem('accessToken');
  }
}
