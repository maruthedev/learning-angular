import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../common/model/user.model';
import { Member } from '../../common/model/member.model';
import { Router } from '@angular/router';
import { MemberService } from '../../common/service/member.service';
import { AuthService } from '../../common/service/auth.service';
import { EmailValidateDirective } from '../../common/directive/email-validate.directive';
import { FisrtFieldAutoFocusDirective } from '../../common/directive/fisrt-field-auto-focus.directive';
import { RequiredFieldDirective } from '../../common/directive/required-field.directive';
import { MatDialog } from '@angular/material/dialog';
import { CommonPopupComponent } from '../common/common-popup/common-popup.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule, CommonModule, EmailValidateDirective, FisrtFieldAutoFocusDirective, RequiredFieldDirective, TranslatePipe],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  loginUser: User = new User("", "");
  loggedMember: Member | undefined = undefined;
  @ViewChild('userForm') userForm!: ElementRef<any>;

  constructor(
    private memberService: MemberService,
    private router: Router,
    private authService: AuthService,
    private matDialog: MatDialog
  ) { }

  async onSubmit(userForm: any): Promise<void> {
    let invalids = this.getAllInvalidMessages(userForm);
    if (invalids != "") {
      const dialog = this.matDialog.open(CommonPopupComponent, {
        width: '300px',
        height: '300px',
        disableClose: true,
        data: {
          title: 'INVALID',
          message: invalids,
          type: 'INFORMATION'
        }
      });
      return;
    }
    this.loggedMember = await this.memberService.login(this.loginUser);
    if (this.loggedMember) {
      this.authService.setAccessToken(this.loggedMember.id);
      this.authService.setMemberRole(this.loggedMember.role);
      this.router.navigate(["/home"]);
    }
  }

  getAllInvalidMessages(userForm: any): string {
    let formControls = userForm.form.controls;
    let result = "";
    if (formControls.email.errors) {
      if (formControls.email.errors.invalidEmail) {
        result += "Email is invalid."
      }
      if (formControls.email.errors.required) {
        result += "Email is required."
      }
    }
    if (formControls.password.errors) {
      if (formControls.password.errors.required) {
        result += "Password is required."
      }
    }
    return result;
  }
}
