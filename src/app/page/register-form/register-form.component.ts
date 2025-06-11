import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Member } from '../../model/member.model';
import { emailValidator } from '../../directive/email-validate/email-validate.directive';
import { telValidator } from '../../directive/tel-validate/tel-validate.directive';
import { ageValidator } from '../../directive/age-validate/age-validate.directive';
import { retypePasswordValidator } from '../../directive/retype-password-validate/retype-password-validate.directive';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {
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
        ageValidator(1, 999)
      ]
    ],
    tel: [
      this.registMember.tel,
      [
        telValidator(new RegExp('^0[1-9]{3}[0-9]{6}$'))
      ]
    ],
    email: [
      this.registMember.email,
      [
        Validators.required,
        emailValidator(new RegExp('^[a-zA-Z0-9]+@[a-z]+\.[a-z]+$'))
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
        Validators.required,
        retypePasswordValidator(this.registMember.password)
      ]
    ]
  })

  onSubmit(): void {
    console.log(this.memberForm.get('name')?.value);
    console.log(this.memberForm.get('gender')?.value);
    console.log(this.memberForm.get('age')?.value);
    console.log(this.memberForm.get('tel')?.value);
    console.log(this.memberForm.get('email')?.value);
    console.log(this.memberForm.get('password')?.value);
  }
}
