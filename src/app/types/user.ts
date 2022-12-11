export interface loginUserDto {
  email: string;
  password: string;
}

export interface registerUserDto extends loginUserDto {
  image: string | null;
  username: string;
}

export enum authEndpoints {
  signup = "signup",
  login = "login",
  logout = "logout",
}
