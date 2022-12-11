import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { MaterialModule } from "../Material-Module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PrivateRoutingModule } from "./private-routing.module";

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
})
export class PrivateModule {}
