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
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BaseFormComponent } from '../common/base-form/base-form.component';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule, CommonModule, EmailValidateDirective, RequiredFieldDirective, TranslatePipe],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent extends BaseFormComponent implements AfterViewInit{
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

  async onSubmit(userForm: any): Promise<void> {
    let invalids: Array<string> = this.getAllInvalidMessages(userForm);
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
}
