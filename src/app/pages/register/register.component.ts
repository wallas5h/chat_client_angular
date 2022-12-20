import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "src/app/Material-Module";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: "./register.component.html",
  styles: [],
})
export class RegisterComponent implements OnInit {
  constructor(private authService: AuthService) {}

  imageBgUrl =
    "https://images.pexels.com/photos/3178818/pexels-photo-3178818.jpeg?auto=compress&cs=tinysrgb&w=640&h=960&dpr=1";

  ngOnInit(): void {}

  isPasswordMatch = false;
  uploadingImg = false;
  uploadImage = null;
  uploadImageUrl: string | null = null;

  registerForms = new FormGroup({
    email: new FormControl(
      "",
      Validators.compose([Validators.email, Validators.required])
    ),
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
    confirmPassword: new FormControl("", Validators.required),
  });

  imagePreview = this.uploadImageUrl
    ? this.uploadImageUrl
    : "../../../../assets/add2";

  async createUser() {
    this.checkPasswordMatch();

    if (this.registerForms.valid && this.isPasswordMatch) {
      await this.authService.register({
        username: String(this.registerForms.value.username),
        email: String(this.registerForms.value.email),
        password: String(this.registerForms.value.password),
        image: this.uploadImageUrl,
      });
    }
  }

  checkPasswordMatch() {
    if (
      this.registerForms.value.password ===
      this.registerForms.value.confirmPassword
    ) {
      this.isPasswordMatch = true;
    }
  }

  async validateImg(e: any) {
    let file: any;
    if (e.target.files && e.target.files[0]) {
      file = e.target.files[0];
    }

    if (file === undefined || null) return;

    if (file.size > 1048576) {
      return alert("Max file size is 1MB");
    } else {
      this.uploadImage = file;
      this.imagePreview = await this.uploadImageInCloud(file);
      this.uploadImageUrl = this.imagePreview;
    }
  }

  async uploadImageInCloud(image: any) {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "enelcoff");

    try {
      this.uploadingImg = true;
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/dkdynfku8/image/upload",
        {
          method: "post",
          body: data,
        }
      );

      const urlData = await res.json();
      this.uploadingImg = false;
      return urlData.url;
    } catch (e) {
      this.uploadingImg = false;
      console.log(e);
    }
  }
}
