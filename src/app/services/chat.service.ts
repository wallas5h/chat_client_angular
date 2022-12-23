import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { apiUrl } from "src/config/api";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  constructor(private http: HttpClient) {}

  getRooms() {
    return this.http.get(apiUrl + "/rooms");
  }

  getMembers() {
    return this.http.get(apiUrl + "/rooms");
  }
}
