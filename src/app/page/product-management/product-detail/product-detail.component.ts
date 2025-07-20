import { Component, ElementRef, input, InputSignal, OnChanges, output, OutputEmitterRef, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../common/model/product.model';
import { AuthService } from '../../../common/service/auth.service';
import { ProductManagementService } from '../product-management.service';
import { CommonModule } from '@angular/common';
import { CurrencyTransformDirective } from '../directive/currency-transform.directive';
import { UploadFileService } from '../../../common/service/upload-file.service';
import { APIURL } from '../../../../environments/api.environment';
import { FisrtFieldAutoFocusDirective } from '../../../common/directive/fisrt-field-auto-focus.directive';
import { validateImage } from '../directive/image-validate.directive';
import { MatDialog } from '@angular/material/dialog';
import { CommonPopupComponent } from '../../common/common-popup/common-popup.component';
import { RequiredFieldDirective } from '../../../common/directive/required-field.directive';

@Component({
  selector: 'app-product-detail',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, CurrencyTransformDirective, FisrtFieldAutoFocusDirective, RequiredFieldDirective],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnChanges {
  currentOperatorRole!: string | null;
  product: Product = Product.getEmptyProduct();
  productForm!: FormGroup | undefined;
  inputProduct: InputSignal<Product> = input(Product.getEmptyProduct());
  changeOutput: OutputEmitterRef<void> = output();
  isEditing: OutputEmitterRef<string> = output();
  minPrice: number = 0.01;
  maxPrice: number = 10000.00;
  fileMaxSize: number = 1000000;
  allowedTypes: Array<string> = ["image/jpeg", "image/png", "image/gif"];
  uploadFile: File | undefined;
  previewFileUrl: string | undefined;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private authService: AuthService,
    private productManagementService: ProductManagementService,
    private formBuilder: FormBuilder,
    private uploadFileService: UploadFileService,
    private renderer: Renderer2,
    private matDialog: MatDialog
  ) {
    this.currentOperatorRole = authService.getMemberRole();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    this.getProductDetail();
    await this.updatePreviewImage();
    this.getProductForm();
  }

  getProductDetail(): void {
    this.product = this.inputProduct();
    if (this.product) {
      this.isEditing.emit("EDITING");
    } else {
      this.isEditing.emit("");
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
        ""
      ],
      name: [
        "",
        [
          Validators.maxLength(20),
          Validators.required
        ]
      ],
      price: [
        "",
        [
          Validators.min(this.minPrice),
          Validators.max(this.maxPrice),
          Validators.required,
        ]
      ],
      image_url: [
        ""
      ],
      imageHolder: [
        this.uploadFile,
        [
          validateImage(this.fileMaxSize, this.allowedTypes)
        ]
      ],
      is_discount_available: [
        ""
      ]
    });
    this.updateFormGroup();
  }

  updateFormGroup(): void {
    if (!this.productForm || !this.product) {
      return;
    }
    this.productForm.patchValue({
      id: this.product.id,
      name: this.product.name,
      price: this.product.price,
      image: this.product.image_url,
      is_discount_available: this.product.is_discount_available
    })
    this.productForm.get("imageHolder")?.reset();
    if (this.currentOperatorRole === "CLIENT") {
      this.productForm.disable();
    } else {
      this.productForm.enable();
    }
  }

  async update(): Promise<void> {
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
    this.product = this.productForm.value;
    this.product.is_discount_available = Number(this.product.is_discount_available);
    await this.productManagementService.updateProduct(this.product);
    this.changeOutput.emit();
  }

  async delete(): Promise<void> {
    if (!this.product) {
      return;
    }
    const dialog = this.matDialog.open(CommonPopupComponent, {
      width: '300px',
      height: '300px',
      disableClose: true,
      data: {
        title: 'DELETE',
        message: `delete product ${this.product.id}?`,
        type: 'CONFIRMATION'
      }
    })
    dialog.afterClosed().subscribe(async result => {
      if (result) {
        try {
          await this.productManagementService.deleteProduct(this.product);
          this.changeOutput.emit();
        } catch (exception) {
          alert("Delete failed");
          console.error(exception);
        }
      }
    })
  }

  onFileSelected(event: Event): void {
    const reader = new FileReader();
    let target = event.target as HTMLInputElement;
    if (target.files?.length) {
      this.uploadFile = target.files[0];
      this.productForm?.get("imageHolder")?.setValue(target.files[0]);
      reader.onload = async () => {
        this.previewFileUrl = reader.result as string;
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
    if (this.currentOperatorRole === "CLIENT" || !this.productForm) {
      return;
    }
    this.uploadFile = undefined;
    this.previewFileUrl = undefined;
    this.productForm.get("image_url")?.reset();
    this.productForm.get("imageHolder")?.reset();
    this.fileInput.nativeElement.value = '';
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
