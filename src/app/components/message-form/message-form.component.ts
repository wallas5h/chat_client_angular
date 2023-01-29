import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
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
import axios from "axios";
import { apiUrl } from "config/api";
import { MaterialModule } from "src/app/Material-Module";
import { ChatRoutingModule } from "src/app/pages/chat/chat-routing.module";
import { AuthService } from "src/app/services/auth.service";
import { socket } from "src/app/services/socketio.service";
import { UploadService } from "src/app/services/upload.service";
import { MessageResponseDto, MessageTypes } from "src/app/types/message.dto";
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
    ChatRoutingModule,
  ],
  templateUrl: "./message-form.component.html",
  styles: [],
})
export class MessageFormComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() room: roomResponseDto = {} as roomResponseDto;
  @Input() privMsgMember: UserFindResponse = {} as UserFindResponse;
  user = this.authService.user;
  messages: MessageResponseDto[] | [] = [];
  currentRoomId: string = "";
  messageType: MessageTypes = MessageTypes.text;

  uploadImageUrl: string | null = "";
  uploadVideoUrl: string = "";
  uploadRawFileUrl: string = "";
  isFileLoaded: boolean = false;

  isMessageHover: boolean = false;
  intervalId: any;
  logNb: number = 0;

  messageForm = new FormGroup({
    newMessage: new FormControl("", Validators.required),
  });

  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private uploadService: UploadService
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
  }

  ngOnInit(): void {
    this.setupRoomInfoAfterPageRefresh();
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setupRoomInfoAfterSideBarChange();
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
  }

  setupRoomInfoAfterPageRefresh = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const roomId = urlParams.get("room");
    const memberId = urlParams.get("member");

    // if (!roomId) return;
    if (roomId) {
      axios
        .get(`${apiUrl}/rooms/${roomId}`)
        .then((res) => {
          this.room = res.data.room;
          this.currentRoomId = this.room._id;

          this.joinRoom(this.room._id);
        })
        .catch(() => {
          console.log("error");
        });
    }
    if (memberId) {
      axios
        .get(`${apiUrl}/users/${memberId}`)
        .then((res) => {
          this.privMsgMember = res.data.user[0];
          const roomId = this.uploadService.orderId(
            String(this.user?.id),
            this.privMsgMember._id
          );
          this.joinRoom(roomId);
          this.currentRoomId = roomId;
        })
        .catch(() => {
          console.log("error");
        });
    }

    this.getMessagesFromRoom();
    this.scrollToBottom();
    this.intervalId = setInterval(() => {
      // this.logNb + 1;
      console.log(this.logNb);
    }, 500);
  };

  setupRoomInfoAfterSideBarChange = () => {
    console.log(this.logNb);
    clearInterval(this.intervalId);
    if (this.room._id && !this.privMsgMember._id) {
      this.currentRoomId = this.room._id;
      this.joinRoom(this.room._id);
    } else if (!this.room._id && this.privMsgMember._id) {
      const roomId = this.uploadService.orderId(
        String(this.user?.id),
        this.privMsgMember._id
      );
      this.currentRoomId = roomId;
      this.joinRoom(roomId);
    } else {
      return;
    }

    // this.getMessagesFromRoom();
    // this.scrollToBottom();

    this.intervalId = setInterval(() => {
      // this.logNb + 1;
      console.log(this.logNb);
    }, 300);
  };

  joinRoom(roomId: string) {
    socket.emit("join-room", roomId);
    this.getMessagesFromRoom();
    this.scrollToBottom();
  }

  getMessagesFromRoom() {
    socket.off("room-messages").on("room-messages", (roomMessages) => {
      this.messages = roomMessages;
    });
  }

  sendMessage(): void {
    // console.log(this.messageForm.value.newMessage);
    let message: string | null | undefined = "";

    switch (this.messageType) {
      case MessageTypes.text:
        message = this.messageForm.value.newMessage;
        break;
      case MessageTypes.image:
        message = this.uploadImageUrl;
        break;
      case MessageTypes.video:
        message = this.uploadVideoUrl;
        break;
      case MessageTypes.raw:
        message = this.uploadRawFileUrl;
        break;

      default:
        break;
    }

    if (!message) return;
    if (!this.currentRoomId) return;

    const stringYearDate = this.uploadService.getStringDate();
    const stringHoursDate = this.uploadService.getStringHours();
    const roomId = this.currentRoomId;

    try {
      socket.emit(
        "message-room",
        roomId,
        message,
        this.messageType,
        this.user,
        stringHoursDate,
        stringYearDate
      );
    } catch (error) {
      this._snackBar.open("Sendin message failed", "Ok", { duration: 3000 });
    } finally {
      this.messageForm.value.newMessage = "";
      this.scrollToBottom();
      this.messageType = MessageTypes.text;
      this.isFileLoaded = false;
    }
  }

  async deleteMessage(messageId: string) {
    try {
      socket.emit("delete-room-messages", messageId, this.currentRoomId);
    } catch (error) {
      this._snackBar.open("Delete message failed", "Ok", { duration: 3000 });
    }
  }

  async cloudUploadImage(e: any) {
    this.messageType = MessageTypes.image;
    this.isFileLoaded = true;

    const validateFile = this.uploadService.validateUploadFile(
      e,
      this.messageType
    );

    if (!validateFile) {
      this.isFileLoaded = false;
      return;
    }

    this.uploadImageUrl = await this.uploadService.uploadFileInCloud(
      validateFile,
      MessageTypes.image,
      this.currentRoomId
    );
    this.sendMessage();
  }

  async cloudUploadVideo(e: any) {
    this.messageType = MessageTypes.video;
    this.isFileLoaded = true;

    const validateFile = this.uploadService.validateUploadFile(
      e,
      this.messageType
    );

    if (!validateFile) {
      this.isFileLoaded = false;
      return;
    }

    this.uploadVideoUrl = await this.uploadService.uploadFileInCloud(
      validateFile,
      MessageTypes.video,
      this.currentRoomId
    );
    this.sendMessage();
  }

  async cloudUploadRawFile(e: any) {
    this.messageType = MessageTypes.raw;
    this.isFileLoaded = true;

    const validateFile = this.uploadService.validateUploadFile(
      e,
      this.messageType
    );

    if (!validateFile) {
      this.isFileLoaded = false;
      return;
    }

    this.uploadRawFileUrl = await this.uploadService.uploadFileInCloud(
      validateFile,
      MessageTypes.raw,
      this.currentRoomId
    );
    this.sendMessage();
  }

  transformBytesToMB(value: string) {
    return (Number(value) / 1000000).toFixed(3);
  }

  scrollToBottom() {
    document.getElementById("point")?.scrollIntoView({ behavior: "smooth" });
  }

  onMessageHover(value: boolean) {
    this.isMessageHover = value;
  }
}
