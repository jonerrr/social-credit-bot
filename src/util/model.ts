import { Schema, model, Document, PaginateModel } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { UserModel } from "./types";

const schema = new Schema(
  {
    _id: { type: String },
    username: { type: String },
    credit: { type: Number },
  },
  { timestamps: true }
);

schema.plugin(paginate);
schema.set("toObject", {
  getters: true,
  virtuals: true,
});
schema.set("versionKey", false);

//@ts-ignore
interface SchemaDocument extends Document, UserModel {}

export const users = model<SchemaDocument, PaginateModel<SchemaDocument>>(
  "users",
  schema
);
