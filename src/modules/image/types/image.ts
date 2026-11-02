import { omitBy, isUndefined, isNil } from "lodash";
export interface IImage {
  _id?: string;
  imageURL?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Image implements IImage {
  _id?: string;
  imageURL?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(input?: IImage) {
    Object.assign(this, input);
  }
  toJSON() {
    return omitBy(this, isUndefined) as IImage;
  }

  toComparable(): IImage {
    return omitBy(this, isNil) as IImage;
  }
}
