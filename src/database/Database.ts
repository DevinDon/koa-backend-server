import { Connection, createConnection, ConnectionOptions } from 'typeorm';

/** 数据库环境. */
export class Database {

  private con: Promise<Connection>;

  constructor(options: ConnectionOptions) {
    this.con = createConnection(options);
  }

  public get connection(): Promise<Connection> {
    return this.con;
  }

}

export default Database;
