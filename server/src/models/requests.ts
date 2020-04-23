export interface IResponse<T> {
  result: boolean;
  error?: T;
  data?: T;
}
