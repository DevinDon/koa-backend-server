/** 格言 */
export interface Aphorism {

  /** 编号 */
  id: number;

  /** 作者 */
  author: string;

  /** 内容 */
  content: string;

  /** 发布日期 */
  date: Date;

  /** 点赞 */
  like: number;

}

export type AphorismID = Aphorism['id'];

export type AphorismParamInsert = Pick<Aphorism, 'author' | 'content' | 'date'>;

export type AphorismParamUpdate = Pick<Aphorism, 'author' | 'content'>;
