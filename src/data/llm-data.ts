import { ObjectId } from "bson";

export interface TitleInfo {
  title: string;
  id: ObjectId;
}

export interface Message {
  role: string;
  content: string;
}
