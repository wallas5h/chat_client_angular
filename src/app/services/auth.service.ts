import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { authEndpoints, loginUserDto, registerUserDto } from "../types/user";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private route: Router,
    private _snackBar: MatSnackBar
  ) {}

  apiUrl = "http://localhost:3001/api/auth";

  isAuthenticated: boolean = false;
  respData: any;

  async login(user: loginUserDto) {
    try {
      await this.http
        .post(`${this.apiUrl}/${authEndpoints.login}`, user)
        .subscribe((res) => {
          this.respData = res;
          if (this.respData.token) {
            this.isAuthenticated = true;
            localStorage.setItem("token", this.respData.token);
            this._snackBar.open("Login success", "Ok", { duration: 3000 });
            this.route.navigate(["../chat"]);
          } else {
            this._snackBar.open("Login failed", "Ok", { duration: 3000 });
          }
        });
    } catch (error) {
      this._snackBar.open("Login failed", "Ok", { duration: 3000 });
    }
  }

  async register(user: registerUserDto) {
    try {
      await this.http
        .post(`${this.apiUrl}/${authEndpoints.signup}`, user)
        .subscribe((res) => {
          this.respData = res;
          if (this.respData.token) {
            this.isAuthenticated = true;
            localStorage.setItem("token", this.respData.token);
            this._snackBar.open("Signup success", "Ok", { duration: 3000 });
            this.route.navigate(["../chat"]);
          } else {
            this._snackBar.open("Signup failed", "Ok", { duration: 3000 });
          }
        });
    } catch (error) {
      this._snackBar.open("Signup failed", "Ok", { duration: 3000 });
    }
  }
}
