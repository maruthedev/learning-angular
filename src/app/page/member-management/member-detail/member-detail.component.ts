import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
export class MemberDetailComponent {
  member!: Member;
  minAge: number = 1;
  maxAge: number = 999;
  telRegex: RegExp = new RegExp('^0[1-9]{3}[0-9]{6}$');
  emailRegex: RegExp = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
  memberForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private memberManagementService: MemberManagementService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getMemberDetail();
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
      ]
    })
  }

  async getMemberDetail() {
    let memberId = this.route.snapshot.paramMap.get('memberId');
    if (!memberId) return;
    this.member = await this.memberManagementService.getMemberDetail(memberId);
    console.log(this.member);
  }

  async onSubmit(): Promise<void> {
    console.log(this.memberForm.value);
    this.member = await this.memberManagementService.updateMember(this.memberForm.value);
    this.router.navigate(['/member/management'])
  }
}
