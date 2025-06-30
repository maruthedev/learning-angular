import { Component, input, InputSignal, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Member } from '../../../common/model/member.model';
import { ageValidator } from '../../../common/directive/age-validate/age-validate.directive';
import { telValidator } from '../../../common/directive/tel-validate/tel-validate.directive';
import { emailValidator } from '../../../common/directive/email-validate/email-validate.directive';
import { CommonModule } from '@angular/common';
import { MemberManagementService } from '../member-management.service';


@Component({
  selector: 'app-member-detail',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnChanges{
  member!: Member;
  memberForm!: FormGroup;
  inputMemberId: InputSignal<string | undefined> = input();
  minAge: number = 1;
  maxAge: number = 999;
  telRegex: RegExp = new RegExp('^0[1-9]{3}[0-9]{6}$');
  emailRegex: RegExp = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');

  constructor(
    private formBuilder: FormBuilder,
    private memberManagementService: MemberManagementService,
    private router: Router
  ) { }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    await this.getMemberDetail();
    this.createFormGroup();
  }

  async getMemberDetail() {
    let id = this.inputMemberId();
    if (!id) return;
    this.member = await this.memberManagementService.getMemberDetail(id);
    this.updateFormGroup();
  }

  createFormGroup(): void{
    if(!this.member){
      return;
    }
    if(this.memberForm){
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
    })
  }

  updateFormGroup(): void{
    if(!this.memberForm){
      return;
    }
    this.memberForm.get("id")?.setValue(this.member.id);
    this.memberForm.get("name")?.setValue(this.member.name);
    this.memberForm.get("gender")?.setValue(this.member.gender);
    this.memberForm.get("age")?.setValue(this.member.age);
    this.memberForm.get("tel")?.setValue(this.member.tel);
    this.memberForm.get("email")?.setValue(this.member.email);
    this.memberForm.get("role")?.setValue(this.member.role);
  }

  async onSubmit(): Promise<void> {
    console.log(this.memberForm.value);
    this.member = await this.memberManagementService.updateMember(this.memberForm.value);
    this.router.navigate(['/member/management'])
  }
}
