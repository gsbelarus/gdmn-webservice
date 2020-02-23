export interface IUser {
  id?: string;
  userName: string;
  password: string;
  activationCode?: string;
  companies?: string[];
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  creatorId: string;
}

export interface IActivationCode {
  code: string;
  date: string;
  user: string;
}

export interface ICompany {
  id: string;
  title: string;
  admin: string;
}

export interface IDevice {
  uid: string;
  user: string;
  isBlock: boolean;
}

export interface IMessage {
  head: {
    id: string;
    producer: string;
    consumer: string;
    companyId: string;
    dateTime: string;
  };
  body: {
    type: string;
    payload: {
      name: string;
      params: string[];
    };
  };
}

export interface IGood {
  id: number;
  name: string;
  barcode: string;
  alias: string;
}

export interface IContact {
  id: number;
  name: string;
  type: number;
}

export interface IRemain {
  goodId: number;
  quantity: number;
  price: number;
  contactId: number;
}

export interface IDocumentType {
  id: number;
  name: string;
}

export interface IDocument {
  id: string;
  head: IHead;
  lines: ILine[];
}

export interface IDocumentLine {
  id: string;
  docId: string;
  goodId: string;
  quantity: number;
}

export interface IHead {
  doctype: number;
  fromcontactId: number;
  tocontactId: number;
  date: string;
}

export interface ILine {
  id: string;
  goodId: number;
  quantity: number;
}
