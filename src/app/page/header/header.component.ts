import { AfterContentChecked, Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MemberService } from '../../service/member-service/member.service';
import { AuthService } from '../../service/auth-service/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements AfterContentChecked{
  accessToken: string | null = null;
  memberRole: string | null = '';
  constructor(
    private router: Router,
    private memberService: MemberService,
    private authService: AuthService
  ){}

  ngAfterContentChecked(): void {
    this.accessToken = this.authService.getAccessToken();
    this.memberRole = this.authService.getMemberRole();
  }

  logout(){
    this.memberService.logout(this.router);
  }
}
