import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appEmailValidate]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: EmailValidateDirective,
      multi: true
    }
  ]
})
export class EmailValidateDirective implements Validator{
  emailRegex: RegExp = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');

  constructor() { }

  validate(control: AbstractControl): ValidationErrors | null {
    return emailValidator(this.emailRegex)(control);
  }
}

export function emailValidator(regex: RegExp): ValidatorFn{
  return (control: AbstractControl): ValidationErrors | null =>{
    if (!control.value) return null;
    let pass = regex.test(control.value);
    return pass ? null : {invalidEmail: true};
  }
}
