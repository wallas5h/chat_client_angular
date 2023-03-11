import { UserEntity } from "./user";

interface MessagesByDate {
  _id: string;
  content: String;
  contentType: String;
  from: UserEntity;
  sockedId: String;
  time: String;
  date: String;
  to: String;
}

export interface MessageResponseDto {
  _id?: string;
  messagesByDate: MessagesByDate[];
}

export enum MessageTypes {
  text = "text",
  image = "image",
  video = "video",
  raw = "raw",
  emoji = "emoji",
}
