import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/model/product.model';
import { ProductManagementService } from './product-management.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../common/service/auth.service';
import { ProductDetailComponent } from "./product-detail/product-detail.component";
import { AddProductComponent } from './add-product/add-product.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-product-management',
  imports: [CommonModule, ProductDetailComponent, AddProductComponent, TranslatePipe],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css'
})
export class ProductManagementComponent implements OnInit {
  allProducts: Array<Product> = [];
  memberRole!: string | null;
  editingProduct: Product = Product.getEmptyProduct();
  operation: string = "IDLING";
  something: string = "";

  constructor(
    private productManagementService: ProductManagementService,
    private authService: AuthService
  ) { }

  async ngOnInit(): Promise<void> {
    this.memberRole = this.authService.getMemberRole();
    await this.loadData();
  }

  async loadData(): Promise<void> {
    this.allProducts = await this.productManagementService.getAllProducts();
    this.editingProduct = Product.getEmptyProduct();
    this.operation = "IDLING";
  }

  rowSelect(product: Product): void {
    this.operation = "EDITING";
    this.editingProduct = Product.clone(product);
  }

  getOperation(event: any): void {
    this.operation = event;
  }

  addNewProduct(): void {
    this.operation = "ADDING";
    this.editingProduct = Product.getEmptyProduct();
  }
}
