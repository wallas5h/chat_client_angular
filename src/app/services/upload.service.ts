import { Injectable } from "@angular/core";
import axios from "axios";
import { MessageTypes } from "../types/message.dto";

@Injectable({
  providedIn: "root",
})
export class UploadService {
  messageType: MessageTypes = MessageTypes.text;

  uploadingImg: boolean = false;
  uploadImage = null;
  uploadImageUrl: string | null = null;
  // imagePreview!: CloudinaryImage;
  imagePreview = this.uploadImageUrl ? this.uploadImageUrl : "";
  uploadFileSucces: boolean = false;

  constructor() {}

  async uploadFileInCloud(file: any, fileType: string, roomId: string) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "enelcoff");
    data.append("folder", `messages/${roomId}`);
    // data.append("public_id", `${file.name}`);

    //file.name

    delete axios.defaults.headers.common["Authorization"];

    return axios
      .post(
        `https://api.cloudinary.com/v1_1/dkdynfku8/${fileType}/upload`,
        data
      )
      .then((res) => {
        if (fileType === MessageTypes.raw) {
          return [res.data.url, file.name, res.data.bytes].join(" | ");
        }
        // console.log(res.data);
        return res.data.url;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  validateUploadFile(e: any, fileType: string) {
    let file: any;
    if (e.target.files && e.target.files[0]) {
      file = e.target.files[0];
    }

    if (file === undefined || null) return null;

    switch (fileType) {
      case MessageTypes.image:
        if (file.size > 10000000) {
          alert("Max file size is 10MB");
          return null;
        }
        break;
      case MessageTypes.video:
        if (file.size > 40000000) {
          alert("Max file size is 40MB");
          return null;
        }
        break;
      case MessageTypes.raw:
        console.log(file);
        if (file.size > 5000000) {
          alert("Max file size is 5MB");
          return null;
        }
        break;

      default:
        break;
    }

    return file;
  }

  orderId = (id1: string, id2: string) => {
    if (id1 > id2) {
      return id1 + "-" + id2;
    } else {
      return id2 + "-" + id1;
    }
  };

  getStringDate = () => {
    const year = new Date().getFullYear().toString();
    const month = (new Date().getMonth() + 1).toString();
    const day = new Date().getUTCDate().toString();

    return `${day}/${month}/${year}`;
  };

  getStringHours = () => {
    const localStringDate = new Date().toLocaleString();
    const date1 = localStringDate.split(", ");
    const date = date1[1];

    return date;
  };
}
