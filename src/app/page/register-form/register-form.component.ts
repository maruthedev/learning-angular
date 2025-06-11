import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Member } from '../../model/member.model';
import { emailValidator } from '../../directive/email-validate/email-validate.directive';
import { telValidator } from '../../directive/tel-validate/tel-validate.directive';
import { ageValidator } from '../../directive/age-validate/age-validate.directive';
import { retypePasswordValidator } from '../../directive/retype-password-validate/retype-password-validate.directive';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {
  minAge: number = 1;
  maxAge: number = 999;
  telRegex: RegExp = new RegExp('^0[1-9]{3}[0-9]{6}$');
  emailRegex: RegExp = new RegExp('^[a-zA-Z0-9]+@[a-z]+\.[a-z]+$');
  registMember: Member = new Member(
    "", "", "", 0, "", "", ""
  );
  formBuilder: FormBuilder = inject(FormBuilder);
  memberForm: FormGroup = this.formBuilder.group({
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

  onSubmit(): void {
    confirm(`new member: ${this.memberForm.get('name')?.value}`);
  }
}
