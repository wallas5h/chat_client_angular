import { CommonModule } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { MaterialModule } from "src/app/Material-Module";
import { AuthService } from "src/app/services/auth.service";
import { UserFindResponse } from "src/app/types/user";

@Component({
  selector: "app-filter-user-form",
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./filter-user-form.component.html",
  styles: [],
})
export class FilterUserFormComponent implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.isSearchingActive.emit(false)
  }

  searchUserForm = new FormGroup({
    username: new FormControl("", Validators.required),
  });

  // findUserRes: UserFindResponse[] | [] | undefined | any = [];
  @Output()findUserRes= new EventEmitter<UserFindResponse[] | [] | undefined | any>;
  @Output() isSearchingActive= new EventEmitter<boolean>;
  isSearching:boolean=false;

  async findUser() {
    if (!this.searchUserForm.value.username) {
      this.isSearchingActive.emit(false)
      this.isSearching=false;
      return;
    };

    this.authService
      .findUserByName(this.searchUserForm.value.username)
      ?.then((res) => {
        if (res.status === 200) {
          this.isSearchingActive.emit(true);
          this.isSearching=true;
          this.findUserRes.emit( res.data.users);
        }
      })
      .catch((err) => {
        this.isSearchingActive.emit(true);
        this.isSearching=true;
        this.findUserRes.emit([]) ;
      });
  }

  handleClickCloseBtn() {
    this.isSearchingActive.emit(false)
    this.searchUserForm.value.username = "";
    this.isSearching=false;
  }
}
