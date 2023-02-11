import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "src/app/services/auth.service";
import { ChatService } from "src/app/services/chat.service";
import { SocketioService } from "src/app/services/socketio.service";
import { roomResponseDto } from "src/app/types/room.dto";
import { UserFindResponse } from "src/app/types/user";
import { MessageFormComponent } from "../../components/message-form/message-form.component";
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { MaterialModule } from "../../Material-Module";
import { ChatRoutingModule } from "./chat-routing.module";

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
    MessageFormComponent,
    ChatRoutingModule,
  ],
})
export class ChatComponent implements OnInit, OnDestroy {
  respData: any;

  results: any | undefined;
  currentRoom: roomResponseDto = {} as roomResponseDto;
  messageMember: UserFindResponse = {} as UserFindResponse;

  constructor(
    private chatService: ChatService,
    private socketioService: SocketioService,
    private authService: AuthService,
    private dialog: MatDialog,
    private ref: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.authService.sendUserNewMessagesStatus();
    this.authService.setUserOnlineStatus(false);
  }

  async ngOnInit(): Promise<void> {
    this.authService.checkUserOnlineStatus();
    this.authService.getUserNewMessages();
  }

  onPassRoomDetails(props: any) {
    if (props.members) {
      this.currentRoom = props;
      this.messageMember = {} as UserFindResponse;
    } else if (!props.members) {
      this.currentRoom = {} as roomResponseDto;
      this.messageMember = props;
    }
  }
}
