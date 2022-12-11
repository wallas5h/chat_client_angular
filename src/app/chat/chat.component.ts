import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MaterialModule } from "../Material-Module";

@Component({
  selector: "app-chat",
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: "./chat.component.html",
  styles: [],
})
export class ChatComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
