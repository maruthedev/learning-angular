import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from '../../common/model/member.model';
import { MemberManagementService } from './member-management.service';
import { AuthService } from '../../common/service/auth.service';
import { MemberDetailComponent } from "./member-detail/member-detail.component";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-member-management',
  imports: [CommonModule, MemberDetailComponent, TranslatePipe],
  templateUrl: './member-management.component.html',
  styleUrl: './member-management.component.css'
})
export class MemberManagementComponent implements OnInit{
  loggedMemberRole!: string | null;
  allMembers: Array<Member> = [];
  editingMember: Member | undefined;

  constructor(
    private authService: AuthService,
    private memberManagementService: MemberManagementService,
    private elementRef: ElementRef
  ){
    
  }

  async ngOnInit(): Promise<void>{
    this.loggedMemberRole = this.authService.getMemberRole();
    this.loadData();
  }

  async loadData(): Promise<void>{
    this.allMembers = await this.memberManagementService.getAllMembers();
    this.editingMember = undefined;
  }

  async rowSelect(member: Member): Promise<void>{
    this.editingMember = member;
  }
}
