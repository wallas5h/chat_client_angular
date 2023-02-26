import { Component, OnDestroy, OnInit } from "@angular/core";

interface PhoneConversation {
  user: string;
  text: string;
  time: string;
}

const phoneConversation: PhoneConversation[] = [
  { user: "man", text: "What's app mamma?", time: "8:12:04" },
  { user: "woman", text: "Hi, papi!!", time: "8:13:42" },
  { user: "man", text: "bla bla bla", time: "8:14:05" },
  { user: "woman", text: "Do you miss me??", time: "8:16:01" },
  { user: "man", text: "No away!", time: "8:16:05" },
];

@Component({
  selector: "app-home-phone-content",
  templateUrl: "./home-phone-content.component.html",
  styleUrls: ["./home-phone.scss"],
})
export class HomePhoneContentComponent implements OnInit, OnDestroy {
  constructor() {}
  ngOnDestroy(): void {
    clearInterval(this.intervalIdTextAnimation);
    clearInterval(this.intervalIdPhoneConversation);
  }

  conversationArray: PhoneConversation[] = [];
  intervalIdPhoneConversation: ReturnType<typeof setInterval> | undefined;
  intervalIdTextAnimation: ReturnType<typeof setInterval> | undefined;

  ngOnInit(): void {
    this.runMessagesAnimation();
  }

  runMessagesAnimation() {
    let i = 0;

    phoneConversation[i].user == "man" &&
      this.textAnimation(phoneConversation[i].text);

    this.intervalIdPhoneConversation = setInterval(() => {
      this.conversationArray.push(phoneConversation[i]);

      if (phoneConversation[i + 1] === undefined) {
        setTimeout(() => {
          this.conversationArray = [];
          phoneConversation[0].user == "man" &&
            this.textAnimation(phoneConversation[0].text);
        }, 2500);

        setTimeout(() => {
          this.conversationArray.push(phoneConversation[0]);
        }, 4500);
        i = 0;
      } else {
        phoneConversation[i + 1].user == "man" &&
          this.textAnimation(phoneConversation[i + 1].text);
        i += 1;
      }
    }, 2500);
  }

  textAnimation(text: string) {
    const input = document.querySelector(".text-input")!;
    let i = 0;
    const splitText = text.split("");
    input.textContent += splitText[i];

    this.intervalIdTextAnimation = setInterval(() => {
      i += 1;
      input.textContent += splitText[i];
      if (i === splitText.length) {
        clearInterval(this.intervalIdTextAnimation);
        i = 0;
        input.textContent = "";
      }
    }, 2000 / splitText.length);
  }

  getDate() {
    return new Date().toLocaleDateString();
  }
}
