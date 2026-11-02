import { isUndefined, omitBy } from "lodash";
import { Types } from "mongoose";

export interface IBlog {
  _id?: string;
  title?: string;
  content?: string;
  adminId?: string;
  blogImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Blog implements IBlog {
  _id?: string;
  title?: string;
  content?: string;
  adminId?: string;
  blogImage?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input?: IBlog) {
    this._id = input?._id
      ? input._id.toString()
      : new Types.ObjectId().toString();
    this.title = input?.title;
    this.content = input?.content;
    this.adminId = input?.adminId;
    this.blogImage = input?.blogImage;
    this.createdAt = input?.createdAt;
    this.updatedAt = input?.updatedAt;
  }

  toJSON(): IBlog {
    return omitBy(this, isUndefined) as IBlog;
  }
}
