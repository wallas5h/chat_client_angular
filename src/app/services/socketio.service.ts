import { Injectable } from "@angular/core";
import { io } from "socket.io-client";
import { apiSocketUrl } from "src/config/api";

// export const socket = io(apiSocketUrl);
export const socket = io("http://localhost:3001");

@Injectable({
  providedIn: "root",
})
export class SocketioService {
  socket: any;

  constructor() {}

  setupSocketConnection() {
    this.socket = io(apiSocketUrl);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
