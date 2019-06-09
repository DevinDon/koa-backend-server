export interface BaseModel<T = any> {
  status: boolean;
  message: string;
  content: T;
}
