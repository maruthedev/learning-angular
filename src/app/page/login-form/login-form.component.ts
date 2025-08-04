import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../common/model/user.model';
import { Member } from '../../common/model/member.model';
import { Router } from '@angular/router';
import { MemberService } from '../../common/service/member.service';
import { AuthService } from '../../common/service/auth.service';
import { EmailValidateDirective } from '../../common/directive/email-validate.directive';
import { RequiredFieldDirective } from '../../common/directive/required-field.directive';
import { MatDialog } from '@angular/material/dialog';
import { CommonPopupComponent } from '../common/common-popup/common-popup.component';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseFormComponent } from '../common/base-form/base-form.component';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule, CommonModule, EmailValidateDirective, RequiredFieldDirective, TranslatePipe],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent extends BaseFormComponent implements AfterViewInit {
  loginUser: User = new User("", "");
  loggedMember: Member | undefined = undefined;
  @ViewChild("userForm") userForm!: NgForm;

  constructor(
    private memberService: MemberService,
    private router: Router,
    private authService: AuthService,
    private matDialog: MatDialog
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.focusOnFirstField(this.userForm)
  }

  async onSubmit(userForm: NgForm): Promise<void> {
    let invalids: Array<string> = this.getAllInvalidMessages();
    if (invalids.length > 0) {
      const dialog = this.matDialog.open(CommonPopupComponent, {
        width: '300px',
        height: '300px',
        disableClose: true,
        data: {
          title: this.translate.instant("popup.title.invalid"),
          message: invalids,
          type: 'INFORMATION'
        }
      });
      dialog.afterClosed().subscribe(() => {
        userForm.form.markAllAsTouched();
        this.focusOnFirstInvalidField(this.userForm);
      })
      return;
    }
    this.loggedMember = await this.memberService.login(this.loginUser);
    if (this.loggedMember) {
      this.authService.setAccessToken(this.loggedMember.id);
      this.authService.setMemberRole(this.loggedMember.role);
      this.router.navigate(["/home"]);
    }
  }

  override getAllInvalidMessages(): Array<string> {
    if(!this.userForm){
      this.errorMessages.length = 0;
      return this.errorMessages;
    }
    super.getAllInvalidMessages();
    const controls = this.userForm.form.controls;
    for (const fieldName of Object.keys(controls)) {
      const control = controls[fieldName];
      if (control.errors?.['required']) {
        this.errorMessages.push(this.translate.instant("warn_message.field.required", { "field": fieldName }));
      } else if (control.invalid && control.value) {
        if(control.errors?.['maxlength']){
          this.errorMessages.push(this.translate.instant("warn_message.field.max_length", { "field": fieldName, "max_length": control.errors?.['maxlength'].requiredLength }));
        } else {
          this.errorMessages.push(this.translate.instant("warn_message.field.invalid", { "field": fieldName }));
        }
      }
    }
    return this.errorMessages;
  }
}
