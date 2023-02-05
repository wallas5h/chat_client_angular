import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import axios from "axios";
import { apiUrl } from "src/config/api";
import {
  authEndpoints,
  loginUserDto,
  registerUserDto,
  UserEntity,
} from "../types/user";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private route: Router,
    private _snackBar: MatSnackBar
  ) {
    this.user = this.getUserData();
  }

  apisUrl: string = `${apiUrl}/users`;

  isAuthenticated: boolean = false;
  respData: any;
  user: UserEntity | undefined;

  async login(user: loginUserDto) {
    axios
      .post(`${this.apisUrl}/${authEndpoints.login}`, user)
      .then((res) => {
        if (res.status == 200) {
          this.isAuthenticated = true;
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("data", res.data.data);

          this._snackBar.open("Login success", "Ok", { duration: 3000 });
          this.route.navigate(["../chat"]);
        } else {
          this._snackBar.open("Login failed", "Ok", { duration: 3000 });
        }
      })
      .catch((err) => {
        this._snackBar.open("Login failed", "Ok", { duration: 3000 });
      });
  }

  async register(user: registerUserDto) {
    axios
      .post(`${this.apisUrl}/${authEndpoints.signup}`, user)
      .then((res) => {
        if (res.status == 200) {
          this.isAuthenticated = true;
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("data", res.data.data);

          this._snackBar.open("Signup success", "Ok", { duration: 3000 });
          this.route.navigate(["../chat"]);
        } else {
          this._snackBar.open("Signup failed", "Ok", { duration: 3000 });
        }
      })
      .catch((err) => {
        this._snackBar.open("Signup failed", "Ok", { duration: 3000 });
      });
  }

  async logout() {
    axios
      .delete(`${this.apisUrl}/${authEndpoints.logout}`)
      .then((res) => {
        if (res.status === 200) {
          this.isAuthenticated = false;
          localStorage.clear();
          this._snackBar.open("Logout success", "Ok", { duration: 3000 });
          this.route.navigate(["/login"]);
        }
      })
      .catch((err) => {
        this._snackBar.open("Logout failed", "Ok", { duration: 3000 });
      });
  }

  getUsers() {
    return axios.get(`${this.apisUrl}`);
  }

  getUserData() {
    let hashedData = localStorage.getItem("data");

    if (hashedData !== null) {
      const helper = new JwtHelperService();
      const extractData = helper.decodeToken(hashedData);
      return extractData;
    } else {
      return "";
    }
  }

  findUserByName(inputName: string) {
    const body = {
      name: String(inputName),
    };

    if (body.name.length > 50) {
      this._snackBar.open("To long name", "Ok", { duration: 3000 });
      return;
    }

    return axios.post(`${this.apisUrl}/${authEndpoints.findUsers}`, body);
  }
}
