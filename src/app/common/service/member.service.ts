import { Injectable } from '@angular/core';
import { Member } from '../model/member.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../model/user.model';
import { APIURL } from '../../../environments/api.environment';
import { firstValueFrom} from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private loggedMember: Member | undefined = undefined;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  async helloWorld(): Promise<void> {
    this.http.get<any>(`${APIURL.baseURL}:${APIURL.port}/hello`)
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
    let url = `${APIURL.baseURL}:${APIURL.port}/member/login`;
    let response = await firstValueFrom(this.http.post<any>(url, user, { headers: headers }));
    try {
      this.loggedMember = new Member(response.id, response.name, response.gender ?? undefined, response.age, response.tel, response.role, response.email, null);
    } catch (exception: any) {
      console.error(exception);
    }
    console.log(this.loggedMember);
    return this.loggedMember;
  }

  async register(member: Member): Promise<Member | undefined> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let response = await firstValueFrom(this.http.post<any>(`${APIURL.baseURL}:${APIURL.port}/member/register`, member, { headers: headers }));
    try {
      this.loggedMember = new Member(response.id, response.name, response.gender ?? undefined, response.age, response.tel, response.role, response.email, null);
    } catch (exception: any) {
      console.error(exception);
    }
    return this.loggedMember;
  }

  logout(router: Router): void{
    this.authService.setAccessToken("");
    this.authService.setMemberRole("");
    router.navigate(["/login"]);
  }
}
