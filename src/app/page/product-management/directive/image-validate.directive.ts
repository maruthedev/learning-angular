import { Directive } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appImageValidate]'
})
export class ImageValidateDirective{
  
}

export function validateImage(maxSize: number, allowedTypes: Array<string>): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let image = control.value;
    if(!image){
      return null;
    }
    let pass = image.size <= maxSize && allowedTypes.includes(image.type);
    return pass ? null : { notValidImage: true };
  }
}
