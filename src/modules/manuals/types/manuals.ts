import { isUndefined, omitBy } from "lodash";
import { Types } from "mongoose";

export interface IManuals {
  _id?: string;
  pdfURL?: string;
  pdfId?: string;
  title?: string;
  arabianTitle?: string;
  arabianSubCategory?: string;
  arabianType?: string;
  type?: string;
  subCategory?: string;
  language?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Manuals implements IManuals {
  _id?: string;
  pdfURL?: string;
  pdfId?: string;
  title?: string;
  subCategory?: string;
  arabianTitle?: string;
  arabianSubCategory?: string;
  arabianType?: string;
  type?: string;
  isActive?: boolean;
  language?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input?: IManuals) {
    this._id = input?._id
      ? input._id.toString()
      : new Types.ObjectId().toString();
    this.language = input?.language;
    this.pdfId = input?.pdfId;
    this.pdfURL = input?.pdfURL;
    this.subCategory = input?.subCategory;
    this.isActive = input?.isActive;
    this.title = input?.title;
    this.arabianTitle = input?.arabianTitle;
    this.arabianSubCategory = input?.arabianSubCategory;
    this.arabianType = input?.arabianType;
    this.type = input?.type;
    this.updatedAt = input?.updatedAt;
    this.createdAt = input?.createdAt;
  }
  toJSON(): IManuals {
    return omitBy(this, isUndefined) as IManuals;
  }
}
