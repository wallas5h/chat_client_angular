import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MaterialModule } from "src/app/Material-Module";
import { ResendEmailVerificatonPopupComponent } from "../resend-email-verificaton-popup/resend-email-verificaton-popup.component";

interface DataType {
  message: string;
  email?: string;
  additionalInfo: boolean;
}

@Component({
  selector: "app-loginpopup",
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: "./loginpopup.component.html",
  styles: [],
})
export class LoginpopupComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DataType,
    public dialogRef: MatDialogRef<LoginpopupComponent>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  handleClickCloseBtn() {
    this.dialogRef.close();
  }

  resendEmailConfirmation() {
    this.dialogRef.close();

    let popup = this.dialog.open(ResendEmailVerificatonPopupComponent, {
      maxHeight: "100vh",
      maxWidth: "100vw",
      data: {
        email: this.data.email,
      },
    });
  }
}
