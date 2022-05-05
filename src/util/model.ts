import { Schema, model, Document, PaginateModel } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { UserModel, ServerModel } from "./types";

const userSchema = new Schema(
  {
    _id: { type: String },
    username: { type: String },
    credit: { type: Number },
    sentiment: Boolean,
    popQuiz: Boolean,
    voteExpire: Number,
  },
  { timestamps: true }
);

userSchema.plugin(paginate);
userSchema.set("toObject", {
  getters: true,
  virtuals: true,
});
userSchema.set("versionKey", false);

//@ts-ignore
interface SchemaDocument extends Document, UserModel {}

const serverSchema = new Schema<ServerModel>(
  {
    _id: { type: String, required: true },
    sentiment: { type: Boolean, required: true },
    popQuiz: { type: Boolean, required: true },
  },
  { timestamps: true }
);
serverSchema.set("toObject", {
  getters: true,
  virtuals: true,
});
serverSchema.set("versionKey", false);

export const users = model<SchemaDocument, PaginateModel<SchemaDocument>>(
  "users",
  userSchema
);

export const servers = model<ServerModel>("servers", serverSchema);
