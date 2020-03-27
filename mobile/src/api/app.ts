import { ApiMethod } from '../model';

export class AppConfig extends ApiMethod {
  url: string;

  setUrl = (url: string) => {
    this.url = url;
  };
}
