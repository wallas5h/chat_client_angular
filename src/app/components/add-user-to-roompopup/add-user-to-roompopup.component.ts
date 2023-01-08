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
import { MaterialModule } from "src/app/Material-Module";
import { AuthService } from "src/app/services/auth.service";

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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<AddUserToRoompopupComponent>,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  updateRoom() {
    console.log(this.roomForm.value);
  }

  inviteUserToRoom() {
    // console.log(name, id);
    console.log(this.addUserForm.value.username);
    this.addUserForm.value.username = "";
  }
}
