import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  setAccessToken(accessToken: string){
    localStorage.setItem("accessToken", accessToken);
  }

  getMemberRole(): string | null {
    return localStorage.getItem("memberRole");
  }

  setMemberRole(memberRole: string){
    localStorage.setItem("memberRole", memberRole);
  }
}
