import { IUser } from '../models';
export declare const findById: (id: string) => Promise<IUser | undefined>;
export declare const findByUserName: (userName: string) => Promise<IUser | undefined>;
export declare const saveActivationCode: (userId: string) => Promise<string>;
export declare const editeOrganisations: (userId: string, organisations: string[]) => Promise<1 | 0>;
