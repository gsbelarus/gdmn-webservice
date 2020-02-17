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
    }
  }
}

export interface IGood {
  ID: string;
  ALIAS: string;
  BARCODE: string;
  NAME: string;
  QUANTITY: number;
  PRICE: number;
}

export interface IContact {
  ID: string;
  NAME: string;
  CONTACTTYPE: number;
}

export interface IDocumentType {
  ID: string;
  NAME: string;
}

export interface IDocument {
  IDDOC: string;
  DOCUMENTTYPE: string;
  DOCUMENTNAME: string;
  DOCUMENTDATE: string;
  CONTACTKEY: string;
}

export interface IDocumentLine {
  ID: string;
  IDDOC: string;
  GOODKEY: string;
  QUANTITY: number;
}
