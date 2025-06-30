import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from '../../common/model/member.model';
import { MemberManagementService } from './member-management.service';
import { AuthService } from '../../common/service/auth.service';
import { MemberDetailComponent } from "./member-detail/member-detail.component";

@Component({
  selector: 'app-member-management',
  imports: [CommonModule, MemberDetailComponent],
  templateUrl: './member-management.component.html',
  styleUrl: './member-management.component.css'
})
export class MemberManagementComponent implements OnInit{
  loggedMemberRole!: string | null;
  allMembers: Array<Member> = [];
  editingMember: Member | undefined;

  constructor(
    private authService: AuthService,
    private memberManagementService: MemberManagementService
  ){
    
  }

  async ngOnInit(): Promise<void>{
    this.loggedMemberRole = this.authService.getMemberRole();
    this.loadData();
  }

  async loadData(): Promise<void>{
    this.allMembers = await this.memberManagementService.getAllMembers();
  }

  async edit(memberId: string): Promise<void>{
    this.editingMember = await this.memberManagementService.getMemberDetail(memberId);
  }

  delete(member: Member){
    let decision = confirm(`Delete ${member.email}?`);
    if(decision){
      try{
        this.memberManagementService.deleteMember(member);
        this.loadData();
      } catch(exception){
        alert("Delete failed");
        console.error(exception);
      }
    }
  }
}
