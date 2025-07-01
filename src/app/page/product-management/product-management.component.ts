import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/model/product.model';
import { ProductManagementService } from './product-management.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../common/service/auth.service';
import { ProductDetailComponent } from "./product-detail/product-detail.component";

@Component({
  selector: 'app-product-management',
  imports: [CommonModule, ProductDetailComponent],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css'
})
export class ProductManagementComponent implements OnInit{
  allProducts: Array<Product> = [];
  memberRole!: string | null;
  editingProduct: Product | undefined;

  constructor(
    private productManagementService: ProductManagementService,
    private authService: AuthService
  ){}

  async ngOnInit(): Promise<void> {
    this.memberRole = this.authService.getMemberRole();
    await this.loadData();
  }

  async loadData(): Promise<void>{
    this.allProducts = await this.productManagementService.getAllProducts();
  }

  rowSelect(product: Product): void{
    this.editingProduct = product;
  }
}
