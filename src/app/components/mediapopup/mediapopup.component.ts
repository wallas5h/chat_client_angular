import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MaterialModule } from "src/app/Material-Module";
import { MessageTypes } from "src/app/types/message.dto";

interface DataType {
  content: string;
  messageType: MessageTypes.image | MessageTypes.video;
}

@Component({
  selector: "app-mediapopup",
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: "./mediapopup.component.html",
  styles: [],
})
export class MediapopupComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DataType,
    public dialogRef: MatDialogRef<MediapopupComponent>
  ) {}

  ngOnInit(): void {}

  handleClickCloseBtn() {
    this.dialogRef.close();
  }
}
