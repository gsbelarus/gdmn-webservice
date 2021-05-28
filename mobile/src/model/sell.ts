import { IHead, ILine, IDocument } from '../../../common';

export interface ISellDocument extends IDocument {
  id: number;
  head: ISellHead;
  lines: ISellLine[];
}

export interface ISellHead extends IHead {
  docnumber: string;
  expeditorId: number;
  isImportant: boolean;
}

export interface ILineTara {
  tarakey: number;
  type: TTypeTara;
  quantity?: number;
  weight?: number;
}

export interface ISellLine extends ILine {
  orderQuantity?: number;
  numreceive?: string;
  tara?: ILineTara[];
  manufacturingDate?: string;
  barcodes?: string[];
}

export type TTypeTara = 'paper' | 'box' | 'pan';

export type TPriority = 'low' | 'high';

export interface ITara {
  id: number;
  type: TTypeTara;
  name: string;
  priority: TPriority;
  goodkey?: number;
  weight?: number;
  [fieldName: string]: unknown;
}

export interface IWeighedGoods {
  id: number;
  goodkey: number;
  weight?: number;
  datework?: string;
  timework?: string;
  numreceive?: string;
  [fieldName: string]: unknown;
}

export interface IFormParams {
  toContact?: number[];
  expiditor?: number[];
  dateBegin?: string;
  dateEnd?: string;
}

export interface IDocumentParams {
  date?: string;
  expeditorId?: number;
  tocontactId?: number;
  fromcontactId?: number;
  doctype?: number;
  docnumber?: string;
  status?: number;
}
