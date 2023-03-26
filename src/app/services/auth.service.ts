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
          // this.route.navigate(["../chat"]);
        }
      })
      .then(() => {
        this.route.navigate(["../chat"]);
      })
      .catch((err) => {
        if (err.response.data.invalid) {
          this.shopPopupInfo(err.response.data.invalid, user.email, false);
        } else if (err.response.data.unconfirmed) {
          this.shopPopupInfo(err.response.data.unconfirmed, user.email, true);
        } else {
          this._snackBar.open("Login failed, try later.", "Ok", {
            duration: 3000,
          });
        }
      });
  }

  async register(user: registerUserDto) {
    axios
      .post(`${this.apisUrl}/${authEndpoints.signup}`, user)
      .then((res) => {
        if (res.status == 200) {
          if (res.data.message) {
            this.shopPopupInfo(res.data.message, user.email, true);
          }
        }
      })
      .then(() => {
        // this.route.navigate(["../chat"]);
      })
      .catch((err) => {
        if (err.response.data.invalid) {
          this.shopPopupInfo(err.response.data.invalid, user.email, false);
        } else {
          this._snackBar.open("Register failed, try later.", "Ok", {
            duration: 3000,
          });
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

  resendEmailRegisterConfirmation(email: string) {
    const body = {
      email,
    };
    axios
      .post(`${this.apisUrl}/${authEndpoints.resendEmailConfirmation}`, body)
      .then((res) => {
        if (res.status == 200) {
          if (res.data.message) {
            this.shopPopupInfo(res.data.message, email, false);
          }
        }
      })
      .catch((err) => {
        if (err.response.data.invalid) {
          this.shopPopupInfo(err.response.data.invalid, email, false);
        }
      });
  }

  shopPopupInfo(message: string, email = "", additionalInfo = true) {
    this.dialog.open(LoginpopupComponent, {
      minHeight: "20vh",
      minWidth: "300px",
      data: {
        message: message,
        email,
        additionalInfo,
      },
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
