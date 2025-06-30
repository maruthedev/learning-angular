import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../common/service/auth.service';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit{
  accessToken: string | null = null;

  constructor(
    private authService: AuthService
  ){}

  ngOnInit(): void {
    this.accessToken = this.authService.getAccessToken();
  }
}
