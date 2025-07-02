import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { APIURL } from '../../../environments/api.environment';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor(
    private http: HttpClient
  ) { }

  async uploadImage(image: File): Promise<string>{
    const formData = new FormData();
    formData.append('file', image);
    let response = await firstValueFrom(this.http.post<any>(`${APIURL.baseURL}:${APIURL.port}/upload/image`, formData));
    return response.fileUrl;
  }
}
