import { Directive } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appTelValidate]'
})
export class TelValidateDirective {
  constructor() { }
}

export function telValidator(regex: RegExp): ValidatorFn{
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    let pass = regex.test(control.value);
    return pass ? null : {invalidTel: true};
  } 
}
