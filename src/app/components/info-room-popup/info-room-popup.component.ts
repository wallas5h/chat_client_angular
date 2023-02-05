import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MaterialModule } from "src/app/Material-Module";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-info-room-popup",
  templateUrl: "./info-room-popup.component.html",
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    FormsModule,
  ],
  styles: [],
})
export class InfoRoomPopupComponent implements OnInit {
  room = this.data.room;
  members = this.data.room.members;
  user = this.authService.user;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,

    private authService: AuthService
  ) {}

  ngOnInit(): void {}
}
