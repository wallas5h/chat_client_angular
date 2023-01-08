import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import axios from "axios";
import { apiUrl } from "src/config/api";
import { AuthService } from "./auth.service";
import { SocketioService } from "./socketio.service";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  user = this.authService.user;

  constructor(
    private http: HttpClient,
    private socketioService: SocketioService,
    private authService: AuthService
  ) {}

  getRooms() {
    return this.http.get(apiUrl + "/rooms");
  }

  async getMembers() {
    return this.authService.getUsers();
  }

  async createRoom(name: string, type: string) {
    let room = {
      name,
      type,
    };
    const req = this.http.post(`${apiUrl}/rooms`, room);
    req.subscribe((res) => {
      // console.log(res);
    });
    return req;
  }

  async dislikeRoom(roomId: string) {
    const body = {
      id: roomId,
    };
    axios.patch(`${apiUrl}/rooms`, body);
  }

  async deleteRoom(roomId: string) {
    axios.delete(`${apiUrl}/rooms/${roomId}`);
  }
}
