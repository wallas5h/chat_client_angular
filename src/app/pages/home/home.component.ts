import { Component, OnInit } from "@angular/core";

const firstTextSlider = [
  "Are you bored?",
  "Do you feel lonely?",
  "Text with someone interesting!",
  "Meet new people...",
];

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.runFirstSlider();
  }

  runFirstSlider() {
    let i = 0;
    let liElement = document.querySelector(".single--text")!;
    liElement.textContent = firstTextSlider[i];

    setInterval(() => {
      liElement.textContent = firstTextSlider[i + 1];
      i += 1;
      if (i === firstTextSlider.length - 1) i = -1;
    }, 4000);
  }
}
