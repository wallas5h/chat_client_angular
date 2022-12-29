import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";
import { HomeComponent } from "./pages/home/home.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "private",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./private/private.module").then((opt) => opt.PrivateModule),
  },
  {
    path: "chat",
    canActivate: [AuthGuard],
    loadComponent: () =>
      import("./pages/chat/chat.component").then((opt) => opt.ChatComponent),
  },
  {
    path: "login",
    loadComponent: () =>
      import("./pages/login/login.component").then((opt) => opt.LoginComponent),
  },
  {
    path: "register",
    loadComponent: () =>
      import("./pages/register/register.component").then(
        (opt) => opt.RegisterComponent
      ),
  },
  {
    path: "**",
    redirectTo: "login",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
