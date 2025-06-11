import { Directive } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appRetypePasswordValidate]'
})
export class RetypePasswordValidateDirective {
  constructor() { }
}

export function retypePasswordValidator(password: string): ValidatorFn{
  return (control: AbstractControl): ValidationErrors | null =>{
    console.log(password);
    console.log(control.value);
    console.log(password == control.value);
    let pass = (password == control.value.toString());
    return pass ? null : {"invalid": true};
  }
}
