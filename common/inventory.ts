import { IDocument, IHead, ILine, IDocumentType } from './base';

export interface IInventoryDocument extends IDocument {
  id: number;
  head: IInventoryHead;
  lines: IInventoryLine[];
}

export interface IInventoryHead extends IHead {
}

export interface IInventoryLine extends ILine {
}

export interface IReference {
  id: number;
  name: string;
  type: string;
  data: {
    id: number | string;
    name?: string;
    [fieldName: string]: unknown;
  }[];
}
