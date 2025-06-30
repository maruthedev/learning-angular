import { Directive } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appRetypePasswordValidate]'
})
export class RetypePasswordValidateDirective {
  constructor() { }
}

export function retypePasswordValidator(): ValidatorFn{
  return (control: AbstractControl): ValidationErrors | null =>{
    let password = control.get('password')?.value;
    let retypePassword = control.get('retypePassword')?.value;
    let pass = (password == retypePassword);
    return pass ? null : {passwordMismatch: true};
  }
}