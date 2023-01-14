import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MaterialModule } from "src/app/Material-Module";
import { ChatComponent } from "src/app/pages/chat/chat.component";
import { AuthService } from "src/app/services/auth.service";
import { ChatService } from "src/app/services/chat.service";
import { SocketioService } from "src/app/services/socketio.service";
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
  ],
  templateUrl: "./sidebar.component.html",
  styles: [],
})
export class SidebarComponent implements OnInit {
  rooms: roomResponseDto[] | [] = [];
  respData: any;
  members: any = [];
  results: any | undefined;
  roomAddSearchOpt: string | undefined;
  user = this.authService.user;
  roomsArrayLength = this.rooms.length;

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
    private socketioService: SocketioService,
    private authService: AuthService,
    private dialog: MatDialog,
    private ref: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.setRoomsData();

    this.authService.getUsers().subscribe((res) => {
      this.respData = res;
      if (this.respData.users) {
        this.members = this.respData.users;
        console.log(this.members);
      }
    });

    // socket.on("new-user", (payload) => {
    //   console.log("działa chat service");
    //   console.log(payload);
    // });
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

  setCurrentRoom(room: string) {}

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
}
