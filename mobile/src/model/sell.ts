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
