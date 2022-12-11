import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styles: [],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    localStorage.clear();
  }

  imageBgUrl =
    "https://images.pexels.com/photos/3178818/pexels-photo-3178818.jpeg?auto=compress&cs=tinysrgb&w=640&h=960&dpr=1";

  loginForms = new FormGroup({
    email: new FormControl(
      "",
      Validators.compose([Validators.email, Validators.required])
    ),
    password: new FormControl("", Validators.required),
  });

  async loginUser() {
    if (this.loginForms.valid) {
      await this.authService.login({
        email: String(this.loginForms.value.email),
        password: String(this.loginForms.value.password),
      });
    }
  }
}
