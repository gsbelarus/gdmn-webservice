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

export interface IRemain {
  goodId: number;
  quantity: number;
  price: number;
  contactId: number;
}

export interface IContact {
  id: number;
  name: string;
  type?: string;
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
