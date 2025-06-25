import { AfterContentChecked, Component, OnChanges, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements AfterContentChecked{
  accessToken: string | null = null;
  constructor(
    private router: Router
  ){}

  ngAfterContentChecked(): void {
    this.accessToken = localStorage.getItem("accessToken");
  }

  logout(){
    localStorage.removeItem("accessToken");
    this.router.navigate(["/login"]);
  }
}
