import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../common/service/auth.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  access_token: string | null = null;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.access_token = this.authService.getAccessToken();
  }
}
