import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MaterialModule } from "src/app/Material-Module";
import { AuthService } from "src/app/services/auth.service";
import { ChatService } from "src/app/services/chat.service";
import { roomResponseAxios } from "src/app/types/room.dto";

@Component({
  selector: "app-editroompopup",
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    FormsModule,
  ],
  templateUrl: "./editroompopup.component.html",
  styles: [],
})
export class EditroompopupComponent implements OnInit {
  privacyOptions = ["public", "private"];

  roomForm = new FormGroup({
    name: new FormControl(this.data.room.name),
    type: new FormControl(this.data.room.type),
  });

  addUserForm = new FormGroup({
    username: new FormControl("", Validators.required),
  });

  members = this.data.room.members;
  user = this.authService.user;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: roomResponseAxios,
    private ref: MatDialogRef<EditroompopupComponent>,
    private authService: AuthService,
    private chatService: ChatService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  updateRoom() {
    this.data.room.type = String(this.roomForm.value.type);
    this.data.room.name = String(this.roomForm.value.name);
    this.data.room.members = this.members;
    this.chatService
      .updateRoomData(this.data.room)
      .then((res) => {
        if (res.status === 200) {
          this._snackBar.open("Room updated", "Ok", { duration: 3000 });
          // this.closeDialogWindow();
        }
      })
      .catch((err) => {
        this._snackBar.open("Update error, try later", "Ok", {
          duration: 3000,
        });
      });
  }

  deleteMemberFromRoom(id: string) {
    this.members = this.members.filter((item: any) => {
      return item.id !== id;
    });
  }

  closeDialogWindow() {
    this.ref.close();
  }
}
