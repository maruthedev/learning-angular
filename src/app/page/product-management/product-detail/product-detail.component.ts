import { AfterViewInit, Component, ElementRef, input, InputSignal, OnChanges, output, OutputEmitterRef, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../common/model/product.model';
import { AuthService } from '../../../common/service/auth.service';
import { ProductManagementService } from '../product-management.service';
import { CommonModule } from '@angular/common';
import { CurrencyTransformDirective } from '../directive/currency-transform.directive';
import { UploadFileService } from '../../../common/service/upload-file.service';
import { APIURL } from '../../../../environments/api.environment';
import { validateImage } from '../directive/image-validate.directive';
import { MatDialog } from '@angular/material/dialog';
import { CommonPopupComponent } from '../../common/common-popup/common-popup.component';
import { RequiredFieldDirective } from '../../../common/directive/required-field.directive';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseFormComponent } from '../../common/base-form/base-form.component';

@Component({
  selector: 'app-product-detail',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, CurrencyTransformDirective, RequiredFieldDirective, TranslatePipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent extends BaseFormComponent implements OnChanges, AfterViewInit {
  currentOperatorRole!: string | null;
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
    private matDialog: MatDialog
  ) {
    super();
    this.currentOperatorRole = authService.getMemberRole();
  }

  ngAfterViewInit(): void {
    this.focusOnFirstField(this.productForm);
  }

  async ngOnChanges(): Promise<void> {
    this.getProductDetail();
    await this.updatePreviewImage();
    this.getProductForm();
    this.focusOnFirstField(this.productForm);
  }

  getProductDetail(): void {
    if (this.inputProduct()) {
      this.isEditing.emit("EDITING");
    } else {
      this.isEditing.emit("");
    }
  }

  async updatePreviewImage(): Promise<void> {
    if (!this.inputProduct() || !this.inputProduct().image_url) {
      this.uploadFile = undefined;
      this.previewFileUrl = undefined;
    } else {
      this.uploadFile = await this.urlToFile(`${APIURL.baseURL}:${APIURL.port}/${this.inputProduct().image_url}`, "name.png", "image/jpeg");
      this.previewFileUrl = `${APIURL.baseURL}:${APIURL.port}/${this.inputProduct().image_url}`;
    }
  }

  getProductForm(): void {
    if (!this.inputProduct()) {
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
    if (!this.productForm || !this.inputProduct()) {
      return;
    }
    this.productForm.patchValue({
      id: this.inputProduct().id,
      name: this.inputProduct().name,
      price: this.inputProduct().price,
      image: this.inputProduct().image_url,
      is_discount_available: this.inputProduct().is_discount_available
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
          title: this.translate.instant("popup.title.invalid"),
          message: this.getAllInvalidMessages(this.productForm),
          type: 'INFORMATION'
        }
      });
      dialog.afterClosed().subscribe(() => {
        this.productForm?.markAllAsTouched();
        this.focusOnFirstInvalidField(this.productForm);
      });
      return;
    }
    let uploadImgUrl = await this.doUploadImage();
    if (uploadImgUrl) {
      this.productForm.get("image_url")?.setValue(uploadImgUrl);
    }
    let product: Product = this.productForm.value;
    product.is_discount_available = Number(this.inputProduct().is_discount_available);
    await this.productManagementService.updateProduct(product);
    this.changeOutput.emit();
  }

  async delete(): Promise<void> {
    if (!this.inputProduct()) {
      return;
    }
    const dialog = this.matDialog.open(CommonPopupComponent, {
      width: '300px',
      height: '300px',
      disableClose: true,
      data: {
        title: this.translate.instant("popup.title.confirmation.delete"),
        message: [this.translate.instant("popup.message.delete.product", { "product_name": this.inputProduct().name })],
        type: 'CONFIRMATION'
      }
    })
    dialog.afterClosed().subscribe(async result => {
      if (result) {
        try {
          await this.productManagementService.deleteProduct(this.inputProduct());
          this.changeOutput.emit();
        } catch (exception) {
          const dialog1 = this.matDialog.open(CommonPopupComponent, {
            width: '300px',
            height: '300px',
            disableClose: true,
            data: {
              title: this.translate.instant("popup.title.fail"),
              message: [this.translate.instant("popup.message.fail")],
              type: 'INFORMATION'
            }
          });
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
      reader.onload = () => {
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
}
