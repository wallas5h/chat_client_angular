export interface loginUserDto {
  email: string;
  password: string;
}

export interface registerUserDto extends loginUserDto {
  image: string | null;
  name: string;
}

export enum authEndpoints {
  signup = "signup",
  login = "login",
  logout = "logout",
  findUsers = "find",
  newMessages = "messages",
  status = "status",
  resendEmailConfirmation = "resendRegisterVerification",
}

export interface UserEntity {
  id: string;
  name: string;
  email?: string;
  image: string;
  status: string;
  newMessages?: string;
}
export interface UserFindResponse {
  _id: string;
  name: string;
  email?: string;
  image: string;
  status: string;
  newMessages?: string;
}

export enum UserStatus {
  online = "online",
  offline = "offline",
}
