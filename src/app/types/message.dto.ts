import { UserEntity } from "./user";

interface MessagesByDate {
  _id?: string;
  content: String;
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
