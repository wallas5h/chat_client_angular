import { CommonModule } from "@angular/common";
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MaterialModule } from "src/app/Material-Module";
import { AuthService } from "src/app/services/auth.service";
import { socket } from "src/app/services/socketio.service";
import { MessageResponseDto } from "src/app/types/message.dto";
import { roomResponseDto } from "src/app/types/room.dto";
import { UserFindResponse } from "src/app/types/user";

@Component({
  selector: "app-message-form",
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: "./message-form.component.html",
  styles: [],
})
export class MessageFormComponent implements OnInit, OnChanges {
  @Input() room: roomResponseDto = {} as roomResponseDto;
  @Input() privMsgMember: UserFindResponse = {} as UserFindResponse;
  user = this.authService.user;
  messages: MessageResponseDto[] | [] = [];
  currentRoomId: string = "";

  messageForm = new FormGroup({
    newMessage: new FormControl("", Validators.required),
  });

  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // console.log("room i person", this.room, this.privMsgMember);

    if (this.room._id && !this.privMsgMember._id) {
      this.joinRoom(this.room._id);
      this.currentRoomId = this.room._id;
    } else if (!this.room._id && this.privMsgMember._id) {
      const roomId = this.orderId(
        String(this.user?.id),
        this.privMsgMember._id
      );
      this.joinRoom(roomId);
      this.currentRoomId = roomId;
    } else {
      return;
    }

    this.getMessagesFromRoom();
    this.scrollToBottom();
  }

  joinRoom(roomId: string) {
    socket.emit("join-room", roomId);
    this.getMessagesFromRoom();
  }

  getMessagesFromRoom() {
    socket.off("room-messages").on("room-messages", (roomMessages) => {
      this.messages = roomMessages;
    });
  }

  sendMessage() {
    // console.log(this.messageForm.value.newMessage);
    const message = this.messageForm.value.newMessage;

    if (!message) return;
    if (!this.currentRoomId) return;

    const stringYearDate = this.getStringDate();
    const stringHoursDate = this.getStringHours();
    const roomId = this.currentRoomId;

    try {
      socket.emit(
        "message-room",
        roomId,
        message,
        this.user,
        stringHoursDate,
        stringYearDate
      );
    } catch (error) {
      this._snackBar.open("Sendin message failed", "Ok", { duration: 3000 });
    } finally {
      this.messageForm.value.newMessage = "";
      this.scrollToBottom();
    }
  }

  orderId = (id1: string, id2: string) => {
    if (id1 > id2) {
      return id1 + "-" + id2;
    } else {
      return id2 + "-" + id1;
    }
  };

  getStringDate = () => {
    const year = new Date().getFullYear().toString();
    const month = (new Date().getMonth() + 1).toString();
    const day = new Date().getUTCDate().toString();

    return `${day}/${month}/${year}`;
  };

  getStringHours = () => {
    const localStringDate = new Date().toLocaleString();
    const date1 = localStringDate.split(", ");
    const date = date1[1];

    return date;
  };

  scrollToBottom() {
    document.getElementById("point")?.scrollIntoView({ behavior: "smooth" });
  }
}
