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
import { FisrtFieldAutoFocusDirective } from '../../common/directive/fisrt-field-auto-focus.directive';
import { RequiredFieldDirective } from '../../common/directive/required-field.directive';
import { MatDialog } from '@angular/material/dialog';
import { CommonPopupComponent } from '../common/common-popup/common-popup.component';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, CommonModule, FisrtFieldAutoFocusDirective, RequiredFieldDirective],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent implements OnInit {
  loggedMember: Member | undefined = undefined;
  minAge: number = 1;
  maxAge: number = 999;
  telRegex: RegExp = new RegExp('^0[1-9]{3}[0-9]{6}$');
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
  ) { }

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
      })
  }

  async onSubmit(): Promise<void> {
    if (this.memberForm.invalid) {
      const dialog = this.matDialog.open(CommonPopupComponent, {
        width: '300px',
        height: '300px',
        disableClose: true,
        data: {
          title: 'INVALID',
          message: this.getAllInvalidMessages(),
          type: 'INFORMATION'
        }
      });
      return;
    }
    this.loggedMember = await this.memberService.register(this.memberForm.value);
    if (this.loggedMember) {
      confirm("REGISTER SUCCESS");
      this.router.navigate(["/login"]);
    }
  }

  getAllInvalidMessages(): string {
    let result = "";
    if ((!this.memberForm?.get('name')?.value || this.memberForm.get('name')?.invalid)) {
      result += "Name is invalid. ";
    }
    if ((this.memberForm?.get('age')?.hasError('outRangeAge') || this.memberForm?.get('age')?.invalid)) {
      result += `Input age between ${this.minAge}-${this.maxAge}. `;
    }
    if ((this.memberForm?.get('tel')?.hasError('invalidTel') || this.memberForm?.get('tel')?.invalid)) {
      result += "Tel is invalid. ";
    }
    return result;
  }
}
