import { Component, DoCheck, OnChanges, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { UserEntity } from "src/app/types/user";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styles: [],
})
export class HeaderComponent implements OnInit, OnChanges, DoCheck {
  constructor(public authService: AuthService) {}

  isAuthenticated: Boolean = false;
  user: UserEntity | undefined;

  ngDoCheck(): void {
    this.user = this.authService.getUserData();
    this.isAuthenticated = this.user ? true : false;
  }
  ngOnChanges(): void {}

  ngOnInit(): void {}

  checkUserOnlineStatus() {
    this.authService.setUserOnlineStatus(true);
  }

  logout() {
    this.authService.logout();
  }
}
