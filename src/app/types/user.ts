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
}

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  image: string;
  newMessages?: string;
}
