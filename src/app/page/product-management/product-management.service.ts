import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIURL } from '../../../environments/api.environment';
import { Product } from '../../common/model/product.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductManagementService {

  constructor(
    private http: HttpClient
  ) { }

  async getAllProducts(): Promise<Array<Product>> {
    let response = await firstValueFrom(this.http.get<any>(`${APIURL.baseURL}:${APIURL.port}/product/all`));
    return response;
  }

  async getProductDetail(productId: string): Promise<Product> {
    let response = await firstValueFrom(this.http.get<any>(`${APIURL.baseURL}:${APIURL.port}/product/detail?productId=${productId}`));
    return response;
  }

  async updateProduct(product: Product): Promise<Product> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let response = await firstValueFrom(this.http.post<any>(`${APIURL.baseURL}:${APIURL.port}/product/update`, product, { headers: headers }));
    return response;
  }

  async deleteProduct(product: Product): Promise<Product> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let response = await firstValueFrom(this.http.post<any>(`${APIURL.baseURL}:${APIURL.port}/product/delete`, product, { headers: headers }));
    return response;
  }

  async restoreProduct(product: Product): Promise<Product> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let response = await firstValueFrom(this.http.post<any>(`${APIURL.baseURL}:${APIURL.port}/product/restore`, product, { headers: headers }));
    return response;
  }
}
