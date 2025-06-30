import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/model/product.model';
import { ProductService } from './product.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../common/service/auth.service';

@Component({
  selector: 'app-product-management',
  imports: [CommonModule],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css'
})
export class ProductManagementComponent implements OnInit{
  allProducts: Array<Product> = [];
  memberRole!: string | null;

  constructor(
    private productService: ProductService,
    private authService: AuthService
  ){}

  async ngOnInit(): Promise<void> {
    this.memberRole = this.authService.getMemberRole();
    this.allProducts = await this.productService.getAllProducts();
  }

  edit(productId: string): void{

  }

  delete(product: Product): void{

  }
}
