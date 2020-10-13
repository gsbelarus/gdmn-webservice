export interface IDocument {
  id: number;
  head: IHead;
  lines: ILine[];
}

export interface IHead {
  docnumber: string;
  doctype: number;
  fromcontactId: number; //организация-плательщик   
  tocontactId: number; // магазин –подразделение организации плательщика
  date: string;
  status: number;
  roadkey?: number; // 	Маршрут
  departkey?: number; // Необязательное поле склад (подразделение предприятия-производителя)
  ondate: string; //  Дата отгрузки
}

export interface ILine {
  id: number;
  goodId: number;
  quantity: number;
  packagekey?: number; // Вид упаковки 
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
  contractNumber?: string; // Номер договора
  contractDate?: string; // Дата договора
  paycond?: string;  // Условие оплаты
  phoneNumber?: string; // Номер телефона
}

export interface IGood extends IRefData {
  alias?: string;
  barcode?: string;
  groupkey: number; // ID группы товаров
  vat?: number;  // НДС
  valuename?: string;  // Наименование ед. изм.
  pricefso?: number; // цена ФСО
  pricefsn?: number; // цена ФСН
}

export interface IRemain {
  goodId: number;
  quantity: number;
  price: number;
  contactId: number;
}

// справочник магазинов
export interface IOutlets extends IRefData {
  contactType: number; //4
  parent: number; // ID компании-родителя
  address?: string; // Адрес разгрузки
  phoneNumber?: string; // Номер телефона
}

// справочник с задолженностями по клиентам на текущую дату 
export interface IDebt extends IRefData {
  contactkey: number; // ID группы товаров
  ondate?: string;  // Наименование ед. изм.
  saldo?: number; // цена ФСО
  saldodebt?: number; // цена ФСН
}

// справочник маршрутов
export interface IRoad extends IRefData { 
}

// справочник складов
export interface IDepartment extends IRefData { 
}

// справочник видов упаковки
export interface IPackage extends IRefData { 
}

// справочник соответствия товар-упаковка 
export interface IGoodPackage extends IRefData {  // name отсутствует
   goodkey: number;
   packagekey: number;
}


export interface IDocumentStatus {
  id: number;
  name: string;
}