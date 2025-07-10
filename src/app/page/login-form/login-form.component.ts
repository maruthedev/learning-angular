import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User} from '../../common/model/user.model';
import { Member } from '../../common/model/member.model';
import { Router } from '@angular/router';
import { MemberService } from '../../common/service/member.service';
import { AuthService } from '../../common/service/auth.service';
import { EmailValidateDirective } from '../../common/directive/email-validate.directive';
import { FisrtFieldAutoFocusDirective } from '../../common/directive/fisrt-field-auto-focus.directive';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule, CommonModule, EmailValidateDirective, FisrtFieldAutoFocusDirective],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent{
  loginUser: User = new User("", "");
  loggedMember: Member | undefined = undefined;

  constructor(
    private memberService: MemberService,
    private router: Router,
    private authService: AuthService
  ){}

  async onSubmit(): Promise<void> {
    this.loggedMember = await this.memberService.login(this.loginUser);
    if(this.loggedMember){
      this.authService.setAccessToken(this.loggedMember.id);
      this.authService.setMemberRole(this.loggedMember.role);
      this.router.navigate(["/home"]);
    }  
  }
}
