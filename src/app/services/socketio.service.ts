import { Injectable } from "@angular/core";
import { io } from "socket.io-client";
import { apiSocketUrl } from "src/config/api";

export const socket = io(apiSocketUrl);
// export const socket = io("http://localhost:3001");

export interface Dictionary<Value> {
  [param: string]: Value;
}

@Injectable({
  providedIn: "root",
})
export class SocketioService {
  socket: any;
  newMessages: Dictionary<number> =
    JSON.parse(localStorage.getItem("newMessages")!) ?? {};

  constructor() {}

  setupSocketConnection() {
    this.socket = io(apiSocketUrl);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  getNumberOfNewMessages() {
    let messagesJson = localStorage.getItem("newMessages")!;
    this.newMessages = JSON.parse(messagesJson);
    return JSON.parse(messagesJson);
  }

  setNumberOfNewMessages() {
    socket.off("notifications").on("notifications", (room) => {
      if (this.newMessages[room]) {
        this.newMessages[room] += 1;
        localStorage.setItem("newMessages", JSON.stringify(this.newMessages));
      } else {
        this.newMessages[room] = 1;
        localStorage.setItem("newMessages", JSON.stringify(this.newMessages));
      }
    });
  }

  deleteNotification(roomId: string) {
    const msgNotification: Dictionary<number> = JSON.parse(
      localStorage.getItem("newMessages")!
    );
    delete msgNotification[roomId];
    this.newMessages = msgNotification;
    localStorage.setItem("newMessages", JSON.stringify(this.newMessages));
  }

  // getMessagesFromRoom(): MessageResponseDto[] | []  {
  //   let messages;
  //   try {
  //     socket.off("room-messages").on("room-messages", (roomMessages) => {
  //       messages= roomMessages;
  //     });
  //   } catch (error) {
  //     messages= [];
  //   }
  //   return messages
  // }
}
