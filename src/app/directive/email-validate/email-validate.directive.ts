import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

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
  emailRegex: RegExp = new RegExp('^[a-zA-Z0-9]+@[a-z]+\.[a-z]+$');

  constructor() { }

  validate(control: AbstractControl): ValidationErrors | null {
    let pass = this.emailRegex.test(control.value);
    return pass ? null : {"invalid": true};
  }
}
