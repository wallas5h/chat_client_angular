import { Component, OnChanges, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { SocketioService } from "./services/socketio.service";
import { UserEntity } from "./types/user";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styles: [],
})
export class AppComponent implements OnInit, OnDestroy, OnChanges {
  title = "chat";
  user: UserEntity | undefined;

  constructor(
    private socketioService: SocketioService,
    private authService: AuthService
  ) {}

  ngOnChanges(): void {
    this.user = this.authService.getUserData();
    console.log(this.user);
  }

  ngOnInit() {
    this.socketioService.setupSocketConnection();
    // this.user = this.authService.getUserData();
  }

  ngOnDestroy(): void {
    this.socketioService.disconnect();
    // localStorage.clear();
  }
}
