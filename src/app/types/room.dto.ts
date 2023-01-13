export interface roomEntity {
  _id: string;
  type: string;
  members: string[];
  name: string;
}

type Person = {
  name: string;
  id: string;
};

export interface roomResponseDto {
  name: string;
  _id: string;
  createdBy: Person;
  type: string;
  isActive: boolean;
  dislikeMembers: string[];
  members: Person[];
}
export interface roomResponseAxios {
  room: roomResponseDto;
}

export enum roomTypes {
  public = "public",
  private = "private",
}
