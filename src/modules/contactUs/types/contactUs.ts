import { isUndefined, omitBy } from "lodash";
import { Types } from "mongoose";

export interface IContactUs {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: number;
  message?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ContactUs implements IContactUs {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  status?: string;
  phoneNumber?: number;
  message?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input?: IContactUs) {
    this._id = input?._id
      ? input._id.toString()
      : new Types.ObjectId().toString();
    this.firstName = input?.firstName;
    this.lastName = input?.lastName;
    this.email = input?.email;
    this.status = input?.status;
    this.phoneNumber = input?.phoneNumber;
    this.message = input?.message;
    this.createdAt = input?.createdAt;
    this.updatedAt = input?.updatedAt;
  }
  toJSON(): IContactUs {
    return omitBy(this, isUndefined) as IContactUs;
  }
}
