import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styles: [],
})
export class HeaderComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  isAuthenticated = this.authService.isAuthenticated;
}
