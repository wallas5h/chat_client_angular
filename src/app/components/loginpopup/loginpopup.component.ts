import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MaterialModule } from "src/app/Material-Module";

interface DataType {
  message: string;
  email: string;
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
    public dialogRef: MatDialogRef<LoginpopupComponent>
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }

  handleClickCloseBtn() {
    this.dialogRef.close();
  }
}
