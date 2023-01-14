import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "src/app/services/auth.service";
import { ChatService } from "src/app/services/chat.service";
import { SocketioService } from "src/app/services/socketio.service";
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { MaterialModule } from "../../Material-Module";

@Component({
  selector: "app-chat",
  standalone: true,
  templateUrl: "./chat.component.html",
  styles: [],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SidebarComponent,
  ],
})
export class ChatComponent implements OnInit {
  respData: any;

  results: any | undefined;

  constructor(
    private chatService: ChatService,
    private socketioService: SocketioService,
    private authService: AuthService,
    private dialog: MatDialog,
    private ref: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    // socket.on("new-user", (payload) => {
    //   console.log("działa chat service");
    //   console.log(payload);
    // });
  }
}
