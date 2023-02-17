import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class HomeService {
  constructor() {}

  R(x: number, y: number, t: number) {
    return Math.floor(202 + 64 * Math.cos((x * x - y * y) / 300 + t));
  }

  G(x: number, y: number, t: number) {
    return Math.floor(
      202 +
        64 * Math.sin((x * x * Math.cos(t / 4) + y * y * Math.sin(t / 3)) / 300)
    );
  }

  B(x: number, y: number, t: number) {
    return Math.floor(
      212 +
        64 *
          Math.sin(
            5 * Math.sin(t / 9) +
              ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100
          )
    );
  }
}
