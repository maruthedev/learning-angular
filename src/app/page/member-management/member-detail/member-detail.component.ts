import { Component, input, InputSignal, OnChanges, output, OutputEmitterRef, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Member } from '../../../common/model/member.model';
import { ageValidator } from '../../../common/directive/age-validate.directive';
import { telValidator } from '../../../common/directive/tel-validate.directive';
import { CommonModule } from '@angular/common';
import { MemberManagementService } from '../member-management.service';
import { AuthService } from '../../../common/service/auth.service';
import { emailValidator } from '../../../common/directive/email-validate.directive';
import { RequiredFieldDirective } from '../../../common/directive/required-field.directive';
import { MatDialog } from '@angular/material/dialog';
import { CommonPopupComponent } from '../../common/common-popup/common-popup.component';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseFormComponent } from '../../common/base-form/base-form.component';


@Component({
  selector: 'app-member-detail',
  imports: [CommonModule, ReactiveFormsModule, RequiredFieldDirective, TranslatePipe],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent extends BaseFormComponent implements OnChanges {
  currentOperatorRole!: string | null;
  member!: Member | undefined;
  memberForm!: FormGroup | undefined;
  inputMember: InputSignal<Member | undefined> = input();
  changeOutput: OutputEmitterRef<void> = output();
  minAge: number = 1;
  maxAge: number = 999;
  telRegex: RegExp = new RegExp('^(0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$');
  emailRegex: RegExp = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
  previewFileUrl: string | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private memberManagementService: MemberManagementService,
    private authService: AuthService,
    private matDialog: MatDialog
  ) {
    super();
    this.currentOperatorRole = authService.getMemberRole();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getMemberDetail();
    this.getFormGroup();
    this.updatePreviewImage();
    this.focusOnFirstField(this.memberForm);
  }

  getMemberDetail() {
    let inputedMember = this.inputMember();
    this.member = inputedMember;
  }

  getFormGroup(): void {
    if (!this.member) {
      this.memberForm = undefined;
      return;
    }
    if (this.memberForm) {
      this.updateFormGroup();
      return;
    }
    this.memberForm = this.formBuilder.group({
      id: [
        this.member.id
      ],
      name: [
        this.member.name,
        [
          Validators.required,
          Validators.maxLength(20)
        ]
      ],
      gender: this.member.gender,
      age: [
        this.member.age,
        [
          Validators.required,
          ageValidator(this.minAge, this.maxAge)
        ]
      ],
      tel: [
        this.member.tel,
        [
          telValidator(this.telRegex)
        ]
      ],
      email: [
        this.member.email,
        [
          Validators.required,
          emailValidator(this.emailRegex)
        ]
      ],
      role: [
        this.member.role
      ],
      avatar_image_url: [
        this.member.avatar_image_url
      ]
    });
    this.updateFormGroup();
  }

  updateFormGroup(): void {
    if (!this.memberForm || !this.member) {
      return;
    }
    this.memberForm.get("id")?.setValue(this.member.id);
    this.memberForm.get("name")?.setValue(this.member.name);
    this.memberForm.get("gender")?.setValue(this.member.gender);
    this.memberForm.get("age")?.setValue(this.member.age);
    this.memberForm.get("tel")?.setValue(this.member.tel);
    this.memberForm.get("email")?.setValue(this.member.email);
    this.memberForm.get("role")?.setValue(this.member.role);
    this.memberForm.get("avatar_image_url")?.setValue(this.member.avatar_image_url);
    if (this.currentOperatorRole === "ADMIN") {
      this.memberForm.enable();
    } else {
      this.memberForm.disable();
    }
  }

  async update(): Promise<void> {
    if (!this.memberForm) {
      return;
    }
    if (this.memberForm.invalid) {
      const dialog = this.matDialog.open(CommonPopupComponent, {
        width: '300px',
        height: '300px',
        disableClose: true,
        data: {
          title: this.translate.instant("popup.title.invalid"),
          message: this.getAllInvalidMessages(),
          type: 'INFORMATION'
        }
      });
      dialog.afterClosed().subscribe(() => {
        this.memberForm?.markAllAsTouched();
        this.focusOnFirstInvalidField(this.memberForm);
      });
      return;
    }
    this.member = this.memberForm.value;
    if (!this.member) {
      return;
    }
    await this.memberManagementService.updateMember(this.member);
    this.changeOutput.emit();
  }

  async delete(): Promise<void> {
    if (!this.member) {
      return;
    }
    const dialog = this.matDialog.open(CommonPopupComponent, {
      width: '300px',
      height: '300px',
      disableClose: true,
      data: {
        title: this.translate.instant("popup.title.confirmation.delete"),
        message: [this.translate.instant("popup.message.delete.member", { "member_name": this.member.name })],
        type: 'CONFIRMATION'
      }
    });
    dialog.afterClosed().subscribe(async result => {
      if (result) {
        if (!this.member) {
          return;
        }
        try {
          await this.memberManagementService.deleteMember(this.member);
          this.changeOutput.emit();
        } catch (exception) {
          const dialog1 = this.matDialog.open(CommonPopupComponent, {
            width: '300px',
            height: '300px',
            disableClose: true,
            data: {
              title: this.translate.instant("popup.title.fail"),
              message: [this.translate.instant("popup.message.fail")],
              type: 'INFORMATION'
            }
          });
          console.error(exception);
        }
      }
    })
  }

  disableAction() {
    if (this.memberForm?.get("action")?.value == "UPDATE") {
      return this.memberForm.invalid;
    } else {
      return this.member?.role === "ADMIN";
    }
  }

  onFileSelected(event: Event) {
    let imageInputUrl = this.memberForm?.get("avatar_image_url");
    if (!imageInputUrl) {
      return;
    }
    this.previewFileUrl = imageInputUrl.value;
  }

  updatePreviewImage(): void {
    this.previewFileUrl = this.member?.avatar_image_url ?? "";
  }

  override getAllInvalidMessages(): Array<string> {
    debugger;
    if (!this.memberForm) {
      this.errorMessages.length = 0;
      return this.errorMessages;
    }
    super.getAllInvalidMessages();
    const controls = this.memberForm.controls;
    for (const fieldName of Object.keys(controls)) {
      const control = controls[fieldName];
      if (control.errors?.['required']) {
        this.errorMessages.push(this.translate.instant("warn_message.field.required", { "field": fieldName }));
      } else if (control.invalid && (control.value || control.value == 0)) {
        if(control.errors?.['maxlength']){
          this.errorMessages.push(this.translate.instant("warn_message.field.max_length", { "field": fieldName, "max_length": control.errors?.['maxlength'].requiredLength }));
        } else if (control.errors?.['outRangeAge']) {
          this.errorMessages.push(this.translate.instant("warn_message.field.number_out_of_range", { "field": fieldName, "min": this.minAge, "max": this.maxAge }));
        } else {
          this.errorMessages.push(this.translate.instant("warn_message.field.invalid", { "field": fieldName }));
        }
      }
    }
    return this.errorMessages;
  }
}
