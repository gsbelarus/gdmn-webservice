import { IHead, ILine, IDocument } from '../../../common';

export interface ISellDocument extends IDocument {
  id: number;
  head: ISellHead;
  lines: ISellLine[];
}

export interface ISellHead extends IHead {
  docnumber: string;
  expeditorId: number;
}

export interface ILineTara {
  tarakey: number;
  quantity?: number;
}

export interface ISellLine extends ILine {
  orderQuantity?: number;
  tara?: ILineTara[];
}

export interface ITara {
  id: number;
  name: string;
	goodkey?: number;
	weight?: number;
}

/*export interface IUser {
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
*/
