import { Document, Types } from 'mongoose';

export interface NewUser {
  username: string;
  password: string;
}
export interface IUser extends Document, NewUser {
  _id: Types.ObjectId;
  locations: Location[];
  lists: List[];  // vai objectIdt ??
  favorites: Types.ObjectId[];
  comments: Types.ObjectId[];
  date: Date;
}
// -----------------------------------------------
export interface NewLocation {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  }
  description: string;
  category: string;
  imageLink?: string;
  list: Types.ObjectId;
}
export interface Location extends NewLocation {
  createdBy: Types.ObjectId;
}
export interface ILocation extends Document, NewLocation, Location {
  _id: Types.ObjectId;
  date: Date;
}
export enum Category {
  Sights = "sights",
  FoodDrink = "foodDrink",
  Shopping = "shopping",
  MuseumsArt = "museumArt",
}
// ------------------------------------------------
export interface Defaultview {
  lat: number;
  lng: number;
  zoom: number;
}
export interface NewList {
  name: string;
  description: string;
  defaultview: Defaultview;
  public: boolean;
  country: string;
  place: string;
}
export interface List extends NewList {
  createdBy: Types.ObjectId;
  locations: Types.ObjectId[];
  favoritedBy: Types.ObjectId[];
  region: string;
  subregion: string;
}

export interface IList extends Document, NewList, List {
  _id: Types.ObjectId;
  comments: Types.ObjectId[];
  date: Date;
}
// ----------------------------------------------------
export interface NewListComment {
  comment: string;
}
export interface ListComment extends NewListComment {
  list: Types.ObjectId;
  replies: Types.ObjectId[];
  stars: Types.ObjectId[];
  date: Date;
}

export interface IComment extends Document, ListComment {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  edited?:Date;
}
// -----------------------------------------------------
export interface NewCommentReply {
  reply: string;
  listId: Types.ObjectId;
}
export interface CommentReply extends NewCommentReply {
  user: Types.ObjectId;
  commentId: Types.ObjectId;
  date: Date;
}
export interface ICommentReply extends Document, CommentReply {
  _id: Types.ObjectId;
  edited?:Date;
}