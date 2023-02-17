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
import { MatSnackBar } from "@angular/material/snack-bar";
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
import { InfoRoomPopupComponent } from "../info-room-popup/info-room-popup.component";

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
    private uploadService: UploadService,
    private _snackBar: MatSnackBar
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.newMessages = this.socketioService.newMessages;
    this.setMembersData();
  }

  async ngOnInit(): Promise<void> {
    this.setRoomsData();
    this.setMembersData();
    this.socketioService.getNumberOfNewMessages();
    this.socketioService.setNumberOfNewMessages();
    this.newMessages = this.socketioService.newMessages;
  }

  setMembersData() {
    this.authService
      .getUsers()
      .then((res) => {
        if (res.data.users) {
          this.members = res.data.users;
        }
      })
      .catch((err) => {
        this._snackBar.open("Server error, try later", "Ok", {
          duration: 3000,
        });
      });
  }

  setRoomAddSearchOpt(value: string) {
    this.roomAddSearchOpt = value;
  }

  setRoomsData() {
    this.chatService
      .getRooms()
      .then((res) => {
        if (res.data.rooms) {
          this.rooms = res.data.rooms;
          this.roomsArrayLength = this.rooms.length;
        }
      })
      .catch(() => {
        this._snackBar.open("Server error, try later", "Ok", {
          duration: 3000,
        });
      });
  }

  setCurrentRoom(room: roomResponseDto, isRoomTypeMember = false) {
    this.passRoomDetails.emit(room);
    if (isRoomTypeMember) {
      this.socketioService.deleteNotification(
        this.uploadService.orderId(room._id, String(this.user?.id))
      );
    } else {
      this.socketioService.deleteNotification(room._id);
    }
    this.authService.sendUserNewMessagesStatus();
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
    if (confirm("Are you sure to remove this room from list? ")) {
      this.chatService.dislikeRoom(roomId);
      this.setRoomsData();
      this.ref.detectChanges();
    }
  }

  deleteRoom(roomId: string) {
    if (confirm("Are you sure to delete this room? ")) {
      this.chatService.deleteRoom(roomId);
      this.setRoomsData();
      this.ref.detectChanges();
    }
  }

  showRoomInfo(room: roomResponseDto) {
    let popup = this.dialog.open(InfoRoomPopupComponent, {
      width: "300px",
      data: {
        room,
      },
    });

    popup.afterClosed().subscribe(() => {
      this.setRoomsData();
    });
  }

  orderId(memberId: string) {
    return this.uploadService.orderId(memberId, this.user?.id!);
  }
}
