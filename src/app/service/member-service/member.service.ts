import { Injectable } from '@angular/core';
import { Member } from '../../model/member.model';
import data from '../../data/member.json'

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  constructor() { }

  getExistedMember(): Map<string, Member>{
    let result: Map<string, Member> = new Map<string, Member>(); 
    for(let item of data){
      let email = item.email;
      let member = item.member;
      result.set(email, new Member(
        member.id, member.name, member.gender?? undefined, member.age, member.tel?? undefined, member.email, member.password
      ));
    }
    return result;
  }

  addNewMember(member: Member): void{

  }
}
