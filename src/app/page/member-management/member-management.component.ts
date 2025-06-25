import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth-service/auth.service';
import { CommonModule } from '@angular/common';
import { MemberManagementService } from '../../service/member-management-service/member-management.service';
import { Member } from '../../model/member.model';
import { Router } from '@angular/router';

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
