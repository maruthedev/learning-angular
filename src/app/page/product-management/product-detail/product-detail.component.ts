import { Component, input, InputSignal, OnChanges, output, OutputEmitterRef, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../common/model/product.model';
import { AuthService } from '../../../common/service/auth.service';
import { ProductManagementService } from '../product-management.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnChanges {
  currentOperatorRole!: string | null;
  product!: Product;
  productForm!: FormGroup;
  inputProduct: InputSignal<Product | undefined> = input();
  changeOutput: OutputEmitterRef<void> = output();
  minPrice: number = 0.00;
  maxPrice: number = 10000.00;

  constructor(
    private authService: AuthService,
    private productManagementService: ProductManagementService,
    private formBuilder: FormBuilder
  ) {
    this.currentOperatorRole = authService.getMemberRole();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    this.getProductDetail();
    this.getProductForm();
  }

  getProductDetail(): void {
    let inputedProduct = this.inputProduct();
    if (!inputedProduct) return;
    this.product = inputedProduct;
  }

  getProductForm(): void {
    if (!this.product) {
      return;
    }
    if (this.productForm) {
      this.updateProductForm();
      return;
    }
    this.productForm = this.formBuilder.group({
      id: [
        this.product.id
      ],
      name: [
        this.product.name,
        [
          Validators.maxLength(20),
          Validators.required
        ]
      ],
      price: [
        this.product.price,
        [
          Validators.min(this.minPrice),
          Validators.max(this.maxPrice),
          Validators.required
        ]
      ],
      image: [
        this.product.image_url
      ]
    });
    this.updateProductForm();
  }

  updateProductForm(): void {
    if (!this.productForm) {
      return;
    }

    this.productForm.get("id")?.setValue(this.product.id);
    this.productForm.get("name")?.setValue(this.product.name);
    this.productForm.get("price")?.setValue(this.product.price);
    this.productForm.get("image")?.setValue(this.product.image_url);
    if (this.currentOperatorRole === "CLIENT") {
      this.productForm.disable();
    } else {
      this.productForm.enable();
    }
  }

  async onSubmit(): Promise<void> {
    let updatingProduct = this.productForm.value;
    this.product = await this.productManagementService.updateProduct(updatingProduct);
    this.changeOutput.emit();
  }

  async delete(): Promise<void> {
    let decision = confirm(`Delete ${this.product.name}?`);
    if (decision) {
      try {
        this.product = await this.productManagementService.deleteProduct(this.product);
      } catch (exception) {
        alert("Delete failed");
        console.error(exception);
      }
    }
  }

  async restore(): Promise<void> {
    this.product = await this.productManagementService.restoreProduct(this.product);
  }
}
