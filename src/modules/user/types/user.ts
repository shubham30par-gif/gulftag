import { Types } from "mongoose";
import { IImage } from "../../image";
import { isUndefined, omitBy } from "lodash";

export interface IUser {
  _id?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  profileImage?: IImage | string;
  userType?: string;
  blogIds?: string[];
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User implements IUser {
  _id?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  profileImage?: IImage | string;
  userType?: string;
  blogIds?: string[];
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input?: IUser) {
    this._id = input?._id
      ? input._id.toString()
      : new Types.ObjectId().toString();
    this.firstName = input?.firstName;
    this.lastName = input?.lastName;
    this.email = input?.email;
    this.blogIds = input?.blogIds;
    this.profileImage = input?.profileImage;
    this.password = input?.password;
    this.userType = input?.userType;
    this.createdAt = input?.createdAt;
    this.updatedAt = input?.updatedAt;
  }
  toJSON(): IUser {
    return omitBy(this, isUndefined) as IUser;
  }
}
