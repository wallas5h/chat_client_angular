import { Injectable } from "@angular/core";
import { apiSocketUrl } from "config/api";
import { io } from "socket.io-client";

export const socket = io(apiSocketUrl);
// export const socket = io(apiSocketUrl, {
//   query: { token: localStorage.getItem("token") },
// });

export interface Dictionary<Value> {
  [param: string]: Value;
}

@Injectable({
  providedIn: "root",
})
export class SocketioService {
  socket: any;

  newMessages: Dictionary<number> = {} as Dictionary<number>;
  sumOfNewMessages: number = 0;

  constructor() {
    try {
      this.newMessages = JSON.parse(localStorage.getItem("newMessages") ?? "");
    } catch (error) {
      this.newMessages = {} as Dictionary<number>;
    }
    this.setSumOfNewMessages();
  }

  setSumOfNewMessages() {
    const objectValues = Object.values(this.newMessages);
    this.sumOfNewMessages = objectValues.reduce((prev, curr) => {
      return Number(prev) + Number(curr);
    }, 0);

    // console.log(this.sumOfNewMessages);
  }

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
    this.newMessages = JSON.parse(messagesJson) ?? {};
  }

  setNumberOfNewMessages() {
    localStorage.setItem("newMessages", JSON.stringify(this.newMessages));
    socket.off("notifications").on("notifications", (room) => {
      if (this.newMessages[room]) {
        this.newMessages[room] += 1;
        localStorage.setItem("newMessages", JSON.stringify(this.newMessages));
      } else {
        this.newMessages[room] = 1;
        localStorage.setItem("newMessages", JSON.stringify(this.newMessages));
      }
      this.setSumOfNewMessages();
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
