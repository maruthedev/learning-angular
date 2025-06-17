import { inject, Injectable } from '@angular/core';
import { Member } from '../../model/member.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../../model/user.model';
import { APIURL } from '../../environment/api.environment';
import { firstValueFrom, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private loggedMember: Member | undefined = undefined;
  private http: HttpClient = inject(HttpClient);

  constructor() { }

  async helloWorld(): Promise<void> {
    this.http.get<any>(`${APIURL.localBaseURL}/hello`)
      .subscribe({
        next: response => {
          console.log(response);
        },
        error: exception => {
          console.error(exception);
        }
      })
  }

  async login(user: User): Promise<Member | undefined> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let response = await firstValueFrom(this.http.post<any>(`${APIURL.localBaseURL}/member/login`, user, { headers: headers }));
    try {
      this.loggedMember = new Member(response.id, response.name, response.gender ?? undefined, response.age, response.tel, response.email, null);
    } catch (exception: any) {
      console.error(exception);
    }
    return this.loggedMember;
  }

  async register(member: Member): Promise<Member | undefined> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let response = await firstValueFrom(this.http.post<any>(`${APIURL.localBaseURL}/member/register`, member, { headers: headers }));
    try {
      this.loggedMember = new Member(response.id, response.name, response.gender ?? undefined, response.age, response.tel, response.email, null);
    } catch (exception: any) {
      console.error(exception);
    }
    return this.loggedMember;
  }
}
