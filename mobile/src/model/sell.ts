export interface IDocument {
  id: number;
  head: IHead;
  lines: ILine[];
}

export interface IHead {
  doctype: number;
  docnumber: string;
  fromcontactId: number;
  tocontactId: number;
  expeditorId: number;
  date: string;
  status: number;
}

export interface ILine {
  id: string;
  goodId: number;
  quantity: number;
  orderQuantity?: number;
}

export interface IUser {
  id: string;
  userName: string;
  companies?: string[];
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}


export interface IContact {
  id: number;
  name: string;
  type?: number;
  [fieldName: string]: unknown;
}

export interface IDocumentType {
  id: number;
  name: string;
  [fieldName: string]: unknown;
}

export interface IGood {
  id: number;
  name: string;
  barcode?: string;
  alias?: string;
  itemWeight?: number;
  [fieldName: string]: unknown;
}


export interface IReference {
  id: number;
  name: string;
  type: string;
  data: {
    id: number;
    name?: string;
    [fieldName: string]: unknown;
  }[];
}
