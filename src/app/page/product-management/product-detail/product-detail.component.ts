import { Component, input, InputSignal, OnChanges, output, OutputEmitterRef, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../common/model/product.model';
import { AuthService } from '../../../common/service/auth.service';
import { ProductManagementService } from '../product-management.service';
import { CommonModule } from '@angular/common';
import { CurrencyTransformDirective } from '../directive/currency-transform.directive';
import { UploadFileService } from '../../../common/service/upload-file.service';
import { APIURL } from '../../../../environments/api.environment';

@Component({
  selector: 'app-product-detail',
  imports: [ReactiveFormsModule, CommonModule, CurrencyTransformDirective],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnChanges {
  currentOperatorRole!: string | null;
  product!: Product | undefined;
  productForm!: FormGroup | undefined;
  inputProduct: InputSignal<Product | undefined> = input();
  changeOutput: OutputEmitterRef<void> = output();
  minPrice: number = 0.00;
  maxPrice: number = 10000.00;
  uploadFile: File | undefined;
  productImage: File | undefined;
  previewFileUrl: string | undefined;

  constructor(
    private authService: AuthService,
    private productManagementService: ProductManagementService,
    private formBuilder: FormBuilder,
    private uploadFileService: UploadFileService
  ) {
    this.currentOperatorRole = authService.getMemberRole();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    await this.getProductDetail();
    await this.updatePreviewImage();
    this.getProductForm();
  }

  async getProductDetail(): Promise<void> {
    let inputedProduct = this.inputProduct();
    this.product = inputedProduct;
    if (!this.product || !this.product.image_url) {
      return;
    }
  }

  async updatePreviewImage(): Promise<void> {
    if (!this.product || !this.product.image_url) {
      this.uploadFile = undefined;
      this.previewFileUrl = undefined;
    } else {
      this.uploadFile = await this.urlToFile(`${APIURL.baseURL}:${APIURL.port}/${this.product.image_url}`, "name.png", "image/jpeg");
      this.previewFileUrl = `${APIURL.baseURL}:${APIURL.port}/${this.product.image_url}`;
    }
  }

  getProductForm(): void {
    if (!this.product) {
      this.productForm = undefined;
      return;
    }
    if (this.productForm) {
      this.updateFormGroup();
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
      image_url: [
        this.product.image_url
      ],
      imageHolder: [
        this.uploadFile
      ]
    });
    this.updateFormGroup();
  }

  updateFormGroup(): void {
    if (!this.productForm || !this.product) {
      return;
    }
    this.productForm.get("id")?.setValue(this.product.id);
    this.productForm.get("name")?.setValue(this.product.name);
    this.productForm.get("price")?.setValue(this.product.price);
    this.productForm.get("image")?.setValue(this.product.image_url);
    this.productForm.get("imageHolder")?.reset();
    if (this.currentOperatorRole === "CLIENT") {
      this.productForm.disable();
    } else {
      this.productForm.enable();
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.productForm) {
      return;
    }
    let uploadImgUrl = await this.doUploadImage();
    if (uploadImgUrl) {
      this.productForm.get("image_url")?.setValue(uploadImgUrl);
    }
    let updatingProduct = this.productForm.value;
    await this.productManagementService.updateProduct(updatingProduct);
    this.changeOutput.emit();
  }

  async delete(): Promise<void> {
    if (!this.product) {
      return;
    }
    let decision = confirm(`Delete ${this.product.name}?`);
    if (decision) {
      try {
        await this.productManagementService.deleteProduct(this.product);
        this.changeOutput.emit();
      } catch (exception) {
        alert("Delete failed");
        console.error(exception);
      }
    }
  }

  onFileSelected(event: Event): void {
    const reader = new FileReader();
    let target = event.target as HTMLInputElement;
    if (target.files?.length) {
      this.uploadFile = target.files[0];
      reader.onload = async () => {
        this.previewFileUrl = reader.result as string;
        this.productForm?.get("image")?.setValue(reader.result as string);
      };
      reader.readAsDataURL(this.uploadFile);
    }
  }

  async doUploadImage(): Promise<string | undefined> {
    if (!this.uploadFile) {
      return undefined;
    }
    let imageUrl = await this.uploadFileService.uploadImage(this.uploadFile);
    return imageUrl;
  }

  async urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: mimeType });
  }

  clearImage(): void {
    this.uploadFile = undefined;
    this.previewFileUrl = undefined;
    this.productForm?.get("image")?.reset();
    this.productForm?.get("imageHolder")?.reset();
  }
}
