import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import axios from "axios";
import { apiUrl } from "src/config/api";
import { roomResponseDto } from "../types/room.dto";
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
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return axios.get(apiUrl + "/rooms", config);
  }

  async getMembers() {
    return this.authService.getUsers();
  }

  async createRoom(name: string, type: string) {
    let room = {
      name,
      type,
    };
    return axios.post(`${apiUrl}/rooms`, room);
  }

  async dislikeRoom(roomId: string) {
    const body = {
      id: roomId,
    };
    return axios.patch(`${apiUrl}/rooms`, body);
  }

  async deleteRoom(roomId: string) {
    return axios.delete(`${apiUrl}/rooms/${roomId}`);
  }

  async addUserToRoom(roomId: string, userId: string, userName: string) {
    const user = {
      id: userId,
      name: userName,
    };
    return axios.patch(`${apiUrl}/rooms/${roomId}`, user);
  }

  async updateRoomData(room: roomResponseDto) {
    return axios.put(`${apiUrl}/rooms/${room._id}`, room);
  }
}
