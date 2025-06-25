import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User} from '../../model/user.model';
import { EmailValidateDirective } from '../../directive/email-validate/email-validate.directive';
import { MemberService } from '../../service/member-service/member.service';
import { Member } from '../../model/member.model';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth-service/auth.service';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule, CommonModule, EmailValidateDirective],
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
