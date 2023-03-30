import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomePhoneContentComponent } from "./components/home-phone-content/home-phone-content.component";
import { NavComponent } from "./components/nav/nav.component";
import { FilterUserFormComponent } from "./components/sidebar/search-user-form/filter-user-form.component";
import { MaterialModule } from "./Material-Module";
import { ChatRoutingModule } from "./pages/chat/chat-routing.module";
import { HomeComponent } from "./pages/home/home.component";
import { AuthService } from "./services/auth.service";
import { ChatService } from "./services/chat.service";
import { SocketioService } from "./services/socketio.service";
import { TokenInterceptorService } from "./services/token-interceptor.service";
import { UploadService } from "./services/upload.service";
import { ValidationService } from "./services/validation-service.service";

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    HomePhoneContentComponent,
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ChatRoutingModule,
  ],
  providers: [
    AuthService,
    ChatService,
    SocketioService,
    UploadService,
    FilterUserFormComponent,
    ValidationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
