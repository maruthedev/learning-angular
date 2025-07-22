import { AfterContentChecked, Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MemberService } from '../../common/service/member.service';
import { AuthService } from '../../common/service/auth.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, RouterLinkActive, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements AfterContentChecked {
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

  logout() {
    this.memberService.logout(this.router);
  }
}
