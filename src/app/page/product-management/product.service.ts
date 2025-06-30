import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIURL } from '../../../environments/api.environment';
import { Product } from '../../common/model/product.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient
  ) { }

  async getAllProducts(): Promise<Array<Product>>{
    let response = await firstValueFrom(this.http.get<any>(`${APIURL.baseURL}:${APIURL.port}/product/all`))
    return response;
  }
}
