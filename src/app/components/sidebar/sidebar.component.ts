import { CommonModule } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "src/app/Material-Module";
import { ChatRoutingModule } from "src/app/pages/chat/chat-routing.module";
import { ChatComponent } from "src/app/pages/chat/chat.component";
import { AuthService } from "src/app/services/auth.service";
import { ChatService } from "src/app/services/chat.service";
import { Dictionary, SocketioService } from "src/app/services/socketio.service";
import { UploadService } from "src/app/services/upload.service";
import { roomResponseDto, roomTypes } from "src/app/types/room.dto";
import { AddUserToRoompopupComponent } from "../add-user-to-roompopup/add-user-to-roompopup.component";
import { EditroompopupComponent } from "../editroompopup/editroompopup.component";

@Component({
  selector: "app-sidebar",
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
    RouterModule,
    ChatRoutingModule,
  ],
  templateUrl: "./sidebar.component.html",
  styles: [],
})
export class SidebarComponent implements OnInit, OnChanges {
  @Output() passRoomDetails = new EventEmitter<roomResponseDto>();
  rooms: roomResponseDto[] | [] = [];
  respData: any;
  members: any = [];
  results: any | undefined;
  roomAddSearchOpt: string | undefined;
  user = this.authService.user;
  roomsArrayLength = this.rooms.length;

  newMessages: Dictionary<number> = {};

  roomForm = new FormGroup({
    newRoom: new FormControl("", Validators.required),
    private: new FormControl(true),
  });

  searchRoomForm = new FormGroup({
    searchPhrase: new FormControl("", Validators.required),
  });

  constructor(
    private ChatComponent: ChatComponent,
    private chatService: ChatService,
    public socketioService: SocketioService,
    private authService: AuthService,
    private dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private uploadService: UploadService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    // this.socketioService.setNumberOfNewMessages();
    // this.newMessages = this.socketioService.getNumberOfNewMessages();
    // console.log(this.newMessages);
    this.newMessages = this.socketioService.newMessages;
  }

  async ngOnInit(): Promise<void> {
    this.setRoomsData();
    this.socketioService.getNumberOfNewMessages();
    this.socketioService.setNumberOfNewMessages();
    this.newMessages = this.socketioService.newMessages;

    this.authService.getUsers().subscribe((res) => {
      this.respData = res;
      if (this.respData.users) {
        this.members = this.respData.users;
        // console.log(this.members);
      }
    });
  }

  setRoomAddSearchOpt(value: string) {
    this.roomAddSearchOpt = value;
  }

  setRoomsData() {
    this.chatService.getRooms().subscribe((res) => {
      this.respData = res;
      if (this.respData.rooms) {
        this.rooms = this.respData.rooms;
        this.roomsArrayLength = this.rooms.length;
      }
    });
  }

  setCurrentRoom(room: roomResponseDto, isMemberRoom = false) {
    this.passRoomDetails.emit(room);
    if (isMemberRoom) {
      this.socketioService.deleteNotification(
        this.uploadService.orderId(room._id, String(this.user?.id))
      );
    } else {
      this.socketioService.deleteNotification(room._id);
    }
  }

  editRoomProp(room: roomResponseDto) {
    let popup = this.dialog.open(EditroompopupComponent, {
      width: "300px",
      data: {
        room,
      },
    });

    popup.afterClosed().subscribe(() => {
      this.setRoomsData();
    });
  }
  addRoomUser(room: roomResponseDto) {
    let popup = this.dialog.open(AddUserToRoompopupComponent, {
      width: "300px",
      data: {
        room,
      },
    });

    popup.afterClosed().subscribe(() => {
      this.setRoomsData();
    });
  }

  async createNewRoom() {
    const name = this.roomForm.value.newRoom;
    const type = this.roomForm.value.private
      ? roomTypes.private
      : roomTypes.public;

    if (name) {
      await this.chatService.createRoom(name, type);
    }
    this.setRoomsData();
    this.ref.detectChanges();

    this.roomForm.value.newRoom = "";
    this.roomForm.value.private = false;
  }
  searchRoom() {
    this.searchRoomForm.value.searchPhrase = "";
  }

  disLikeRoom(roomId: string) {
    this.chatService.dislikeRoom(roomId);
    this.setRoomsData();
    this.ref.detectChanges();
  }

  deleteRoom(roomId: string) {
    this.chatService.deleteRoom(roomId);
    this.setRoomsData();
    this.ref.detectChanges();
  }

  orderId(memberId: string) {
    return this.uploadService.orderId(memberId, this.user?.id!);
  }
}
