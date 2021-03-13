export interface PaginationParam<ID = number> {
  from?: ID;
  take?: number;
}

export interface Pagination<ID = number, Item = any> {
  next?: ID;
  list: Item[];
}

export { ObjectId } from 'mongodb';
