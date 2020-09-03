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
  type: TTypeTara;
  quantity?: number;
  weight?: number;
}

export interface ISellLine extends ILine {
  orderQuantity?: number;
  numreceive?: string;
  tara?: ILineTara[];
  manufacturingDate?: string;
}

export type TTypeTara = 'paper' | 'box' | 'pan';

export interface ITara {
  id: number;
  type: TTypeTara;
  name: string;
  goodkey?: number;
  weight?: number;
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
}
