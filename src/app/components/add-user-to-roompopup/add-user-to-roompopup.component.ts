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
import { UserFindResponse } from "src/app/types/user";

@Component({
  selector: "app-add-user-to-roompopup",
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    FormsModule,
  ],
  templateUrl: "./add-user-to-roompopup.component.html",
  styles: [],
})
export class AddUserToRoompopupComponent implements OnInit {
  addUserForm = new FormGroup({
    username: new FormControl("", Validators.required),
  });

  room = this.data.room;
  members = this.data.room.members;
  user = this.authService.user;
  findUserRes: UserFindResponse[] | [] | undefined = [];
  findUserFailed: boolean | undefined;
  formUsernameLength = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<AddUserToRoompopupComponent>,
    private authService: AuthService,
    private chatService: ChatService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  async findUser() {
    if (!this.addUserForm.value.username) return;

    this.authService
      .findUserByName(this.addUserForm.value.username)
      ?.then((res) => {
        if (res.status === 200) {
          this.findUserRes = res.data.users;
          this.findUserFailed = false;
        }
      })
      .catch((err) => {
        this.findUserFailed = true;
      });

    this.addUserForm.value.username = "";
  }

  addUserToRoom = (id: string, name: string) => {
    this.chatService
      .addUserToRoom(this.room._id, id, name)
      .then((res) => {
        if (res.status === 200) {
          this._snackBar.open(`${name} added to room`, "Ok", {
            duration: 3000,
          });
        } else if (res.status === 302) {
          this._snackBar.open(`${name} just exist in room`, "Ok", {
            duration: 3000,
          });
        }
      })
      .catch((err) => {
        this._snackBar.open(`${err}`, "Ok", { duration: 3000 });
      });
  };
}
