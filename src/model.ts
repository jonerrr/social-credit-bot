import { Schema, model } from "mongoose";
import { UserModel } from "./types";

const schema = new Schema<UserModel>({
  _id: { type: String },
  username: { type: String },
  credit: { type: Number },
});

export const users = model<UserModel>("users", schema);
