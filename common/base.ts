export interface IDocument {
  id: number;
  head: IHead;
  lines: ILine[];
}

export interface IHead {
  docnumber: string;
  doctype: number;
  fromcontactId: number;
  tocontactId: number;
  date: string;
  status: number;
}

export interface ILine {
  id: number;
  goodId: number;
  quantity: number;
}

export interface IRefData {
  id: number;
  name?: string;
  [fieldName: string]: unknown;
}


export interface IForm {
  name: string;
  // parent: string;
  [name: string]: unknown;
}


export interface IReference<T = IRefData> {
  id: number;
  name: string;
  type: string;
  data: T[];
}

export interface IDocumentMessage {
  name: string;
  data: IDocument[];
}

export interface IContact extends IRefData {
  contactType: number;
}

export interface IGood extends IRefData {
  alias?: string;
  barcode?: string;
}

export interface IRemain {
  goodId: number;
  q: number;
  price: number;
}

export interface IRemains {
  contactId: number;
  date: Date;
  data: IRemain[];
}


export interface IDocumentStatus {
  id: number;
  name: string;
}