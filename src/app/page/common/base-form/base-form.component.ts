import { Component, inject } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-base-form',
  imports: [],
  templateUrl: './base-form.component.html',
  styleUrl: './base-form.component.css'
})
export class BaseFormComponent {
  translate: TranslateService = inject(TranslateService);
  protected errorMessages: Array<string> = [];

  getAllInvalidMessages(): Array<string> {
    return this.errorMessages;
  }

  focusOnFirstInvalidField(form: NgForm | FormGroup | any): void {
    if (!form) {
      return;
    }
    const controls = form instanceof NgForm ? form.form.controls : (form as FormGroup).controls;
    for (const fieldName of Object.keys(controls)) {
      const control = controls[fieldName];
      if (control.invalid) {
        const element = document.querySelector(`[name="${fieldName}"]`) as HTMLElement;
        element?.focus();
        return;
      }
    }
  }

  focusOnFirstField(form: any): void {
    setTimeout(() => {
      if (!form) {
        return;
      }
      let fieldNames: any = Object.keys(form.controls);
      let firstField: any = fieldNames[0];
      if (firstField == "id") {
        firstField = fieldNames[1];
      }
      const element: any = document.querySelector(`[name="${firstField}"]`) as HTMLElement;
      element?.focus();
    })
  }
}
