import { CommonModule } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnChanges,
  OnDestroy,
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
import { UserFindResponse, UserStatus } from "src/app/types/user";
import { AddUserToRoompopupComponent } from "../add-user-to-roompopup/add-user-to-roompopup.component";
import { EditroompopupComponent } from "../editroompopup/editroompopup.component";
import { InfoRoomPopupComponent } from "../info-room-popup/info-room-popup.component";
import { FilterUserFormComponent } from "./search-user-form/filter-user-form.component";

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
    FilterUserFormComponent,
  ],
  templateUrl: "./sidebar.component.html",
  styles: [],
})
export class SidebarComponent implements OnInit, OnChanges, OnDestroy {
  @Output() passRoomDetails = new EventEmitter<roomResponseDto>();
  rooms: roomResponseDto[] | [] = [];
  respData: any;
  members: any = [];
  results: any | undefined;
  roomAddSearchOpt: string | undefined;
  user = this.authService.user;
  roomsArrayLength = this.rooms.length;

  newMessages: Dictionary<number> = {};

  filterSearchActive: boolean = false;
  filterUserSearchResult: any;
  intervalId: any;

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
    private _snackBar: MatSnackBar,
    public filterForm: FilterUserFormComponent
  ) {}
  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.newMessages = this.socketioService.newMessages;
    // this.setMembersData();
  }

  async ngOnInit(): Promise<void> {
    this.setRoomsData();
    this.setMembersData();
    this.socketioService.getNumberOfNewMessages();
    this.socketioService.setNumberOfNewMessages();
    this.newMessages = this.socketioService.newMessages;
  }

  ngAfterViewInit(): void {
    this.intervalId = setInterval(() => {
      this.setMembersData();
    }, 5000);
  }

  setMembersData() {
    this.authService
      .getUsers()
      .then((res) => {
        if (res.data.users) {
          this.members = this.sortMembersArray(res.data.users);
        }
      })
      .catch((err) => {
        this._snackBar.open("Server error: refresh page or try later", "Ok", {
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
        this._snackBar.open(
          "Catch setRoomsData: refresh page or try later",
          "Ok",
          {
            duration: 3000,
          }
        );
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
    this.ChatComponent.hiddenSidebar = true;
    this.socketioService.setSumOfNewMessages();
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
      await this.chatService
        .createRoom(name, type)
        .then((res) => {
          if (res.data.rooms) {
            this.rooms = res.data.rooms;
            this.roomsArrayLength = this.rooms.length;
          }
        })
        .catch(() => {
          this._snackBar.open("Sorry, server error. Try later.", "Ok", {
            duration: 3000,
          });
        });
    }

    this.roomForm.value.newRoom = "";
    this.roomForm.value.private = false;
  }
  searchRoom() {
    this.searchRoomForm.value.searchPhrase = "";
  }

  disLikeRoom(roomId: string) {
    if (confirm("Are you sure to remove this chat from list? ")) {
      this.chatService
        .dislikeRoom(roomId)
        .then((res) => {
          if (res.data.rooms) {
            this.rooms = res.data.rooms;
            this.roomsArrayLength = this.rooms.length;
          }
        })
        .then(() => {
          this.ref.detectChanges();
        })
        .catch(() => {
          this._snackBar.open("Sorry, server error. Try later.", "Ok", {
            duration: 3000,
          });
        });
    }
  }

  deleteRoom(roomId: string) {
    if (confirm("Are you sure to delete this chat? ")) {
      this.chatService
        .deleteRoom(roomId)
        .then((res) => {
          if (res.data.rooms) {
            this.rooms = res.data.rooms;
            this.roomsArrayLength = this.rooms.length;
          }
        })
        .catch(() => {
          this._snackBar.open("Sorry, server error. Try later.", "Ok", {
            duration: 3000,
          });
        });
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

  changeFilterSearchStatus(flag: boolean) {
    this.filterSearchActive = flag;
  }

  setFilterSearchResults(resuts: any) {
    this.filterUserSearchResult = resuts;
  }

  sortByName(a: UserFindResponse, b: UserFindResponse) {
    const tmpA = a.name.toLowerCase();
    const tmpB = b.name.toLowerCase();

    if (tmpA > tmpB) {
      return 1;
    } else if (tmpA < tmpB) {
      return -1;
    } else {
      return 0;
    }
  }

  sortMembersArray(array: UserFindResponse[]) {
    let sortedArray: UserFindResponse[] = [];

    const arrayUser = array.filter((element) => element._id === this.user?.id);

    const arrayWithOutUser = array.filter(
      (element) => element._id !== this.user?.id
    );

    const onlineUsers = arrayWithOutUser
      .filter((element) => element.status === UserStatus.online)
      .sort(this.sortByName);

    const oflineUsers = arrayWithOutUser
      .filter((element) => element.status === UserStatus.offline)
      .sort(this.sortByName);

    return (sortedArray = [...arrayUser, ...onlineUsers, ...oflineUsers]);
  }
}
