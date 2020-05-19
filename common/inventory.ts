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

export interface IInventoryDocumentType extends IDocumentType {
}
