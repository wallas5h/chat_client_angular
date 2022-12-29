import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { UserEntity } from "../types/user";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  isAuthenticated: Boolean = false;
  user: UserEntity | undefined;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.user = this.authService.getUserData();
    this.isAuthenticated = this.user ? true : false;

    if (!this.isAuthenticated) {
      this.router.navigate(["/login"]);
      this._snackBar.open("Login first", "Ok", { duration: 3000 });

      return false;
    } else {
      return true;
    }
  }
}
