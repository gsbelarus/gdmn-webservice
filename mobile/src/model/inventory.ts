export interface IDocument {
  id: number;
  head: IHead;
  lines: ILine[];
}

export interface IHead {
  doctype: number;
  fromcontactId: number;
  tocontactId: number;
  date: string;
  status: number;
}

export interface ILine {
  id: string;
  goodId: number;
  quantity: number;
}

export interface IUser {
  id: string;
  userName: string;
  companies?: string[];
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface IRemain {
  goodId: number;
  quantity: number;
  price: number;
  contactId: number;
}

export interface IContact {
  id: number;
  name: string;
  type: number;
}

export interface IDocumentType {
  id: number;
  name: string;
}

export interface IGood {
  id: number;
  name: string;
  barcode: string;
  alias: string;
}

export interface IReference {
  id: number;
  name: string;
  type: string;
}
