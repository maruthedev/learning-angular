import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-common-popup',
  imports: [CommonModule],
  templateUrl: './common-popup.component.html',
  styleUrl: './common-popup.component.css'
})
export class CommonPopupComponent {
  constructor(
    private matDialogRef: MatDialogRef<CommonPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  confirm(): void {
    this.matDialogRef.close(true);
  }

  cancel(): void {
    this.matDialogRef.close(false);
  }
}
