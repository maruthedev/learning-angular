import { Component, ElementRef, HostListener, input, InputSignal, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Product } from '../../common/model/product.model';
import { ProductManagementService } from './product-management.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../common/service/auth.service';
import { ProductDetailComponent } from "./product-detail/product-detail.component";
import { AddProductComponent } from './add-product/add-product.component';

@Component({
  selector: 'app-product-management',
  imports: [CommonModule, ProductDetailComponent, AddProductComponent],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css'
})
export class ProductManagementComponent implements OnInit{
  allProducts: Array<Product> = [];
  memberRole!: string | null;
  editingProduct: Product | undefined;
  operation: string = "IDLING";

  constructor(
    private productManagementService: ProductManagementService,
    private authService: AuthService,
    private elementRef: ElementRef
  ){}

  async ngOnInit(): Promise<void> {
    this.memberRole = this.authService.getMemberRole();
    await this.loadData();
  }

  async loadData(): Promise<void>{
    this.allProducts = await this.productManagementService.getAllProducts();
    this.editingProduct = undefined;
    this.operation = "IDLING";
  }

  rowSelect(product: Product): void{
    if(this.operation == "ADDING"){
      return;
    }
    this.operation = "EDITING";
    this.editingProduct = product;
  }

  @HostListener('document:click',['$event'])
  unselect(event: MouseEvent): void{
    const target = event.target as HTMLElement;
    if(!this.elementRef.nativeElement.contains(target)){
      this.editingProduct = undefined;
      this.operation = "IDLING";
    }
  }

  getOperation(event: any): void{
    this.operation = event;
  }

  addNewProduct(): void{
    if(this.operation == "EDITING"){
      return;
    }
    this.operation = "ADDING";
  }
}
