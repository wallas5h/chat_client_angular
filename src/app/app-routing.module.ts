import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  {
    path: "private",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./private/private.module").then((opt) => opt.PrivateModule),
  },
  {
    path: "chat",
    // canActivate: [AuthGuard],
    loadComponent: () =>
      import("./chat/chat.component").then((opt) => opt.ChatComponent),
  },
  {
    path: "public",
    loadChildren: () =>
      import("./public/public.module").then((opt) => opt.PublicModule),
  },
  {
    path: "**",
    redirectTo: "public",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
