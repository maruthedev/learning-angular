import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIURL } from '../../../environments/api.environment';
import { firstValueFrom } from 'rxjs';
import { Member } from '../../common/model/member.model';

@Injectable({
  providedIn: 'root'
})
export class MemberManagementService {

  constructor(
    private http: HttpClient
  ) { }

  async getAllMembers(): Promise<Array<Member>> {
    let response = await firstValueFrom(this.http.get<any>(`${APIURL.baseURL}:${APIURL.port}/member/all`));
    try {
      return response;
    } catch (exception) {
      console.error(exception);
      throw exception;
    }
  }

  async updateMember(member: Member): Promise<Member> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let response = await firstValueFrom(this.http.post<any>(`${APIURL.baseURL}:${APIURL.port}/member/update`, member, { headers: headers }));
    try {
      return response;
    } catch (exception) {
      console.error(exception);
      throw exception;
    }
  }

  async deleteMember(member: Member): Promise<Member> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let response = await firstValueFrom(this.http.post<any>(`${APIURL.baseURL}:${APIURL.port}/member/delete`, member, { headers: headers }));
    try {
      return response;
    } catch (exception) {
      console.error(exception);
      throw exception;
    }
  }

  async restoreMember(member: Member): Promise<Member> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let response = await firstValueFrom(this.http.post<any>(`${APIURL.baseURL}:${APIURL.port}/member/restore`, member, { headers: headers }));
    try {
      return response;
    } catch (exception) {
      console.error(exception);
      throw exception;
    }
  }

  async getMemberDetail(memberId: string): Promise<Member> {
    let response = await firstValueFrom(this.http.get<any>(`${APIURL.baseURL}:${APIURL.port}/member/detail?memberId=${memberId}`));
    try {
      return response;
    } catch (exception) {
      console.error(exception);
      throw exception;
    }
  }
}
