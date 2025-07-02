import { Component, input, InputSignal, OnChanges, output, OutputEmitterRef, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Member } from '../../../common/model/member.model';
import { ageValidator } from '../../../common/directive/age-validate.directive';
import { telValidator } from '../../../common/directive/tel-validate.directive';
import { CommonModule } from '@angular/common';
import { MemberManagementService } from '../member-management.service';
import { AuthService } from '../../../common/service/auth.service';
import { emailValidator } from '../../../common/directive/email-validate.directive';


@Component({
  selector: 'app-member-detail',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnChanges {
  currentOperatorRole!: string | null;
  member!: Member | undefined;
  memberForm!: FormGroup | undefined;
  inputMember: InputSignal<Member | undefined> = input();
  changeOutput: OutputEmitterRef<void> = output();
  minAge: number = 1;
  maxAge: number = 999;
  telRegex: RegExp = new RegExp('^0[1-9]{3}[0-9]{6}$');
  emailRegex: RegExp = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');

  constructor(
    private formBuilder: FormBuilder,
    private memberManagementService: MemberManagementService,
    private authService: AuthService
  ) {
    this.currentOperatorRole = authService.getMemberRole();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getMemberDetail();
    this.getFormGroup();
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
    if (this.currentOperatorRole === "ADMIN") {
      this.memberForm.enable();
    } else {
      this.memberForm.disable();
    }
  }

  async onSubmit(): Promise<void> {
    if(!this.memberForm){
      return;
    }
    await this.memberManagementService.updateMember(this.memberForm.value);
    this.changeOutput.emit();
  }

  async delete(): Promise<void> {
    if(!this.member){
      return;
    }
    let decision = confirm(`Delete ${this.member.email}?`);
    if (decision) {
      try {
        await this.memberManagementService.deleteMember(this.member);
        this.changeOutput.emit();
      } catch (exception) {
        alert("Delete failed");
        console.error(exception);
      }
    }
  }
}
