import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "src/app/Material-Module";
import { AuthService } from "src/app/services/auth.service";

interface DataType {
  email?: string;
}

@Component({
  selector: "app-resend-email-verificaton-popup",
  templateUrl: "./resend-email-verificaton-popup.component.html",
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ],
  styles: [],
})
export class ResendEmailVerificatonPopupComponent implements OnInit {
  constructor(
    private authService: AuthService,

    @Inject(MAT_DIALOG_DATA) public data: DataType,
    public dialogRef: MatDialogRef<ResendEmailVerificatonPopupComponent>,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {}

  confirmationForms = new FormGroup({
    email: new FormControl(
      this.data.email,
      Validators.compose([Validators.email, Validators.required])
    ),
  });

  resendEmailConfirmation() {
    this.authService.resendEmailRegisterConfirmation(
      String(this.confirmationForms.value.email)
    );
    this.dialogRef.close();
  }
}
