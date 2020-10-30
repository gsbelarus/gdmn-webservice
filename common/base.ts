export interface IDocument {
  id: number;
  head: IHead;
  lines: ILine[];
}

export interface IHead {
  docnumber: string;
  doctype: number;
  contactId: number; //организация-плательщик   
  outletId: number; // магазин –подразделение организации плательщика
  date: string;
  status: number;
  roadId?: number; // 	Маршрут
  departId?: number; // Необязательное поле склад (подразделение предприятия-производителя)
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

// справочник групп товаров
export interface IGoodGroup extends IRefData {
  parent?: number; // родитель
}

export interface IRemain {
  goodId: number;
  quantity: number;
  price: number;
  contactId: number;
}

// справочник магазинов
export interface IOutlet extends IRefData {
  contactType: number; //4
  parent: number; // ID компании-родителя
  address?: string; // Адрес разгрузки
  phoneNumber?: string; // Номер телефона
}

// справочник с задолженностями по клиентам на текущую дату 
export interface IDebt extends IRefData {
  contactkey: number; // ID организации
  ondate?: string;  // текущая дата
  saldo?: number; // сальдо
  saldodebt?: number; //сальдо просроченное
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