import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import axios from "axios";
import { apiUrl } from "src/config/api";
import { LoginpopupComponent } from "../components/loginpopup/loginpopup.component";
import {
  authEndpoints,
  loginUserDto,
  registerUserDto,
  UserEntity,
  UserStatus,
} from "../types/user";
import { Dictionary, socket, SocketioService } from "./socketio.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private route: Router,
    private _snackBar: MatSnackBar,
    private socketService: SocketioService,
    private dialog: MatDialog
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
        } else {
          this._snackBar.open("Login failed", "Ok", { duration: 3000 });
        }
      })
      .then((res) => {
        this.route.navigate(["../chat"]);
      })
      .catch((err) => {
        if (err.response.data.invalid) {
          let popup = this.dialog.open(LoginpopupComponent, {
            minHeight: "20vh",
            maxHeight: "100vh",
            data: {
              message: err.response.data.invalid,
              email: user.email,
            },
          });
        } else {
          this._snackBar.open("Login failed", "Ok", { duration: 3000 });
        }
      });
  }

  async register(user: registerUserDto) {
    axios
      .post(`${this.apisUrl}/${authEndpoints.signup}`, user)
      .then((res) => {
        if (res.status == 200) {
          if (res.data.message) {
            let popup = this.dialog.open(LoginpopupComponent, {
              minHeight: "20vh",
              maxHeight: "100vh",
              data: {
                message: res.data.message,
                email: user.email,
              },
            });
            return;
          }
        }
      })
      .then(() => {
        // this.route.navigate(["../chat"]);
      })
      .catch((err) => {
        if (err.response.data.invalid) {
          let popup = this.dialog.open(LoginpopupComponent, {
            minHeight: "20vh",
            maxHeight: "100vh",
            data: {
              message: err.response.data.invalid,
              email: user.email,
            },
          });
        } else {
          this._snackBar.open("Login failed", "Ok", { duration: 3000 });
        }
      });
  }

  async logout() {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    axios
      .delete(`${this.apisUrl}/${authEndpoints.logout}`, config)
      .then((res) => {
        if (res.status === 200) {
          this.isAuthenticated = false;
          localStorage.clear();
          this.route.navigate(["/login"]);
        }
      })
      .catch((err) => {
        localStorage.clear();
        // this._snackBar.open("Logout failed", "Ok", { duration: 3000 });
      });
  }

  setUserOnlineStatus(status: boolean) {
    const userStatus = {
      status: status ? UserStatus.online : UserStatus.offline,
    };

    const data = {
      userId: this.user?.id,
      status: userStatus.status,
    };

    socket.emit("user-status", data);
  }

  getUsers() {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return axios.get(`${this.apisUrl}`, config);
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

  getUserNewMessages() {
    let newMessages: Dictionary<number>;

    if (!this.user) return;

    axios
      .get(`${this.apisUrl}/${authEndpoints.newMessages}`)
      .then((res) => {
        if (res.status === 200) {
          newMessages = res.data.newMessages ?? {};
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        localStorage.setItem("newMessages", JSON.stringify(newMessages));
      });
  }

  sendUserNewMessagesStatus() {
    if (!this.user) return;

    axios
      .post(
        `${this.apisUrl}/${authEndpoints.newMessages}`,
        this.socketService.newMessages
      )
      .then((res) => {
        if (res.status === 200) {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  checkUserOnlineStatus() {
    if (!this.user) return;

    window.addEventListener("load", () => {
      this.setUserOnlineStatus(navigator.onLine);
    });
    window.addEventListener("online", () => {
      this.setUserOnlineStatus(true);
    });
    window.addEventListener("offline", () => {
      this.setUserOnlineStatus(false);
    });
  }

  sendUserOfflineStatusOnCloseTab() {
    window.addEventListener("beforeunload", (e) => {
      this.setUserOnlineStatus(false);
    });
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
