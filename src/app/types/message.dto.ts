import { UserEntity } from "./user";

interface MessagesByDate {
  _id: string;
  content: string;
  contentType: string;
  from: UserEntity;
  sockedId: string;
  time: string;
  date: string;
  to: string;
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
