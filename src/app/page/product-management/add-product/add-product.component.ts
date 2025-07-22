import { Component, ElementRef, HostListener, OnInit, output, OutputEmitterRef, ViewChild } from '@angular/core';
import { Product } from '../../../common/model/product.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CurrencyTransformDirective } from '../directive/currency-transform.directive';
import { AuthService } from '../../../common/service/auth.service';
import { UploadFileService } from '../../../common/service/upload-file.service';
import { ProductManagementService } from '../product-management.service';
import { FisrtFieldAutoFocusDirective } from '../../../common/directive/fisrt-field-auto-focus.directive';
import { validateImage } from '../directive/image-validate.directive';
import { CommonPopupComponent } from '../../common/common-popup/common-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { RequiredFieldDirective } from '../../../common/directive/required-field.directive';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-add-product',
  imports: [ReactiveFormsModule, CommonModule, CurrencyTransformDirective, FisrtFieldAutoFocusDirective, RequiredFieldDirective, TranslatePipe],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {
  currentOperatorRole: string | null;
  product: Product = Product.getEmptyProduct();
  productForm: FormGroup | undefined;
  minPrice: number = 0.01;
  maxPrice: number = 10000.00;
  fileMaxSize: number = 1000000;
  allowedTypes: Array<string> = ["image/jpeg", "image/png", "image/gif"];
  uploadFile: File | undefined;
  previewFileUrl: string | undefined;
  isAdding: OutputEmitterRef<string> = output();
  exitAdding: OutputEmitterRef<void> = output();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private elementRef: ElementRef,
    private uploadFileService: UploadFileService,
    private productManagementService: ProductManagementService,
    private matDialog: MatDialog
  ) {
    this.currentOperatorRole = authService.getMemberRole();
  }

  ngOnInit(): void {
    this.isAdding.emit("ADDING");
    this.getProductForm();
  }

  getProductForm(): void {
    if (this.productForm) {
      return;
    }
    this.productForm = this.formBuilder.group({
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
        this.uploadFile,
        [
          validateImage(this.fileMaxSize, this.allowedTypes)
        ]
      ],
      is_discount_available: [
        this.product.is_discount_available
      ]
    });
  }

  async onSubmit(): Promise<void> {
    if (!this.productForm) {
      return;
    }
    if (this.productForm.invalid) {
      const dialog = this.matDialog.open(CommonPopupComponent, {
        width: '300px',
        height: '300px',
        disableClose: true,
        data: {
          title: 'INVALID',
          message: this.getAllInvalidMessages(),
          type: 'INFORMATION'
        }
      })
      return;
    }
    let uploadImgUrl = await this.doUploadImage();
    if (uploadImgUrl) {
      this.productForm.get("image_url")?.setValue(uploadImgUrl);
    }
    let addingProduct: Product = this.productForm.value;
    addingProduct.is_discount_available = Number(addingProduct.is_discount_available);
    await this.productManagementService.addProduct(addingProduct);
    this.exitAdding.emit();
  }

  async doUploadImage(): Promise<string | undefined> {
    if (!this.uploadFile) {
      return undefined;
    }
    let imageUrl = await this.uploadFileService.uploadImage(this.uploadFile);
    return imageUrl;
  }

  clearImage() {
    if (this.currentOperatorRole === "CLIENT") {
      return;
    }
    this.uploadFile = undefined;
    this.previewFileUrl = undefined;
    this.productForm?.get("image_url")?.reset();
    this.productForm?.get("imageHolder")?.reset();
    this.fileInput.nativeElement.value = '';
  }

  onFileSelected(event: Event) {
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

  getAllInvalidMessages(): string {
    let result = "";
    if ((!this.productForm?.get('name')?.value || this.productForm?.get('name')?.invalid)) {
      result += "Name is invalid. ";
    }
    if ((!this.productForm?.get('price')?.value || this.productForm?.get('price')?.invalid)) {
      result += "Price is invalid. ";
    }
    if (this.productForm?.get('imageHolder')?.hasError('notValidImage')) {
      result += "Image is invalid. Must be png, jpg, gif and size is equal or less than 1MB";
    }
    return result;
  }
}
