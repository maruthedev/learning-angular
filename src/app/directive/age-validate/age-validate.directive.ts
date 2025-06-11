import { Directive } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appAgeValidate]'
})
export class AgeValidateDirective {
  constructor() { }
}

export function ageValidator(min: number, max: number): ValidatorFn{
  return (control: AbstractControl): ValidationErrors | null => {
    let pass = control.value >= min && control.value <= max;
    return pass ? null : {outRangeAge: true};
  }
}
