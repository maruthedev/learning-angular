import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Member } from '../../common/model/member.model';
import { telValidator } from '../../common/directive/tel-validate.directive';
import { ageValidator } from '../../common/directive/age-validate.directive';
import { retypePasswordValidator } from '../../common/directive/retype-password-validate.directive';
import { Router } from '@angular/router';
import { MemberService } from '../../common/service/member.service';
import { emailValidator } from '../../common/directive/email-validate.directive';
import { RequiredFieldDirective } from '../../common/directive/required-field.directive';
import { MatDialog } from '@angular/material/dialog';
import { CommonPopupComponent } from '../common/common-popup/common-popup.component';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseFormComponent } from '../common/base-form/base-form.component';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, CommonModule, RequiredFieldDirective, TranslatePipe],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent extends BaseFormComponent implements OnInit {
  loggedMember: Member | undefined = undefined;
  minAge: number = 1;
  maxAge: number = 999;
  telRegex: RegExp = new RegExp('^(0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$');
  emailRegex: RegExp = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
  registMember: Member = new Member(
    "", "", "", 0, "", "", 1, "", "", null
  );
  memberForm!: FormGroup;

  constructor(
    private memberService: MemberService,
    private router: Router,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.memberForm = this.formBuilder.group({
      name: [
        this.registMember.name,
        [
          Validators.required,
          Validators.maxLength(20)
        ]
      ],
      gender: this.registMember.gender,
      age: [
        this.registMember.age,
        [
          Validators.required,
          ageValidator(this.minAge, this.maxAge)
        ]
      ],
      tel: [
        this.registMember.tel,
        [
          telValidator(this.telRegex)
        ]
      ],
      email: [
        this.registMember.email,
        [
          Validators.required,
          emailValidator(this.emailRegex)
        ]
      ],
      password: [
        this.registMember.password,
        [
          Validators.required
        ]
      ],
      retypePassword: [
        '',
        [
          Validators.required
        ]
      ]
    },
      {
        validators: retypePasswordValidator()
      });
    this.focusOnFirstField(this.memberForm);
  }

  async onSubmit(): Promise<void> {
    if (this.memberForm.invalid) {
      const dialog = this.matDialog.open(CommonPopupComponent, {
        width: '300px',
        height: '300px',
        disableClose: true,
        data: {
          title: 'INVALID',
          message: this.getAllInvalidMessages(this.memberForm),
          type: 'INFORMATION'
        }
      });
      dialog.afterClosed().subscribe(() => {
        this.focusOnFirstInvalidField(this.memberForm);
      });
      return;
    }
    this.loggedMember = await this.memberService.register(this.memberForm.value);
    if (this.loggedMember) {
      const dialog = this.matDialog.open(CommonPopupComponent, {
        width: '300px',
        height: '300px',
        disableClose: true,
        data: {
          title: this.translate.instant("popup.title.success"),
          message: [this.translate.instant("popup.message.success")],
          type: 'INFORMATION'
        }
      });
      dialog.afterClosed().subscribe(() => {
        this.router.navigate(["/login"]);
      });
    }
  }
}
