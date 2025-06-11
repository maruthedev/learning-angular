import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User} from '../../model/user.model';
import { Member} from '../../model/member.model';
import { EmailValidateDirective } from '../../directive/email-validate/email-validate.directive';
import { MemberService } from '../../service/member-service/member.service';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule, CommonModule, EmailValidateDirective],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent implements OnInit{
  memberService: MemberService = inject(MemberService);
  existedMember: Map<string, Member> = new Map<string, Member>();
  loginUser: User = new User("", "");

  ngOnInit(): void {
    this.existedMember = this.memberService.getExistedMember();
  }

  onSubmit(): void {
    if(!this.existedMember.has(this.loginUser.email)){
      alert("login failed")
      return;
    }
    let member: Member | undefined = this.existedMember.get(this.loginUser.email);
    if(!member || member.password != this.loginUser.password){
      alert("login failed")
      return;
    }
    confirm(`logged in as ${member.name}`)
  }
}
