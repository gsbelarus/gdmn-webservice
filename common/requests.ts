export interface IResponse<T> {
  result: boolean;
  error?: string;
  data?: T;
}
