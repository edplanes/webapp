import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

export type Data = {
  message?: string;
  buttonText?: {
    ok?: string;
    cancel?: string;
  };
};

@Component({
  selector: 'app-message-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './message-dialog.component.html',
  styleUrl: './message-dialog.component.scss',
})
export class MessageDialogComponent {
  message: string = 'Are you sure?';
  confirmButtonText = 'Yes';
  cancelButtonText = 'Cancel';

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Data,
    private dialogRef: MatDialogRef<MessageDialogComponent>
  ) {
    this.message = data.message || this.message;
    data.buttonText &&
      ((this.confirmButtonText = data.buttonText.ok || this.confirmButtonText),
      (this.cancelButtonText =
        data.buttonText.cancel || this.cancelButtonText));
  }

  onConfirmClick() {
    this.dialogRef.close(true);
  }
}
