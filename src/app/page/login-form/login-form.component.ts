import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User} from '../../model/user.model';
import { EmailValidateDirective } from '../../directive/email-validate/email-validate.directive';
import { MemberService } from '../../service/member-service/member.service';
import { Member } from '../../model/member.model';
import { Router } from '@angular/router';

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
    private router: Router
  ){}

  async onSubmit(): Promise<void> {
    this.loggedMember = await this.memberService.login(this.loginUser);
    if(this.loggedMember){
      localStorage.setItem("accessToken", this.loggedMember.id);
      this.router.navigate(["/home"]);
    }  
  }
}
