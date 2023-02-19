import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { HomeService } from "src/app/services/home.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild("canvas", { static: true })
  private canvas: ElementRef<HTMLCanvasElement> = {} as ElementRef<
    HTMLCanvasElement
  >;

  private ctx: CanvasRenderingContext2D = {} as CanvasRenderingContext2D;

  t: number = 0;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext("2d")!;

    setInterval(() => {
      this.runCanvasAnimation();
    }, 1000 / 15);
  }

  col(x: number, y: number, r: number, g: number, b: number) {
    this.ctx.fillStyle = `rgb(${r},${g}, ${b})`;

    this.ctx.fillRect(x, y, 1, 1);
  }

  runCanvasAnimation() {
    let maxX = 35;
    let maxY = 35;
    for (let x = 0; x <= maxX; x++) {
      for (let y = 0; y <= maxY; y++) {
        this.col(
          x,
          y,
          this.homeService.R(x, y, this.t),
          this.homeService.G(x, y, this.t),
          this.homeService.B(x, y, this.t)
        );
      }
    }
    this.t = this.t + 0.12;
  }
}
