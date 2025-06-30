import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from '../../common/model/member.model';
import { Router } from '@angular/router';
import { MemberManagementService } from './member-management.service';
import { AuthService } from '../../common/service/auth.service';

@Component({
  selector: 'app-member-management',
  imports: [CommonModule],
  templateUrl: './member-management.component.html',
  styleUrl: './member-management.component.css'
})
export class MemberManagementComponent implements OnInit{
  memberRole!: string | null;
  memberRoleDef: Map<string, string> = new Map<string, string>(
    [
      ['ADMIN','ADMIN'],
      ['USER','USER'],
      ['CLIENT','CLIENT']
    ]
  )
  allMembers: Array<Member> = [];

  constructor(
    private authService: AuthService,
    private memberManagementService: MemberManagementService,
    private router: Router
  ){
    
  }

  async ngOnInit(): Promise<void>{
    this.memberRole = this.authService.getMemberRole();
    this.loadData();
  }

  async loadData(): Promise<void>{
    this.allMembers = await this.memberManagementService.getAllMembers();
  }

  edit(memberId: string){
    this.router.navigate(['/member/detail', memberId]);
  }

  delete(member: Member){
    let decision = confirm(`Delete ${member.email}?`);
    if(decision){
      try{
        this.memberManagementService.deleteMember(member);
        confirm("Delete successfully");
        this.loadData();
      } catch(exception){
        alert("Delete failed");
        console.error(exception);
      }
    }
  }
}
