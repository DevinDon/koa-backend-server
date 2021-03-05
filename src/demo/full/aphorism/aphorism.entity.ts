import { BaseEntity, Column, Entity, Index, ObjectID, ObjectIdColumn } from '../../../main/declares/typeorm';
import { IsDate, IsNotEmpty, Length } from '../../../main/declares/validator';
import { Aphorism } from './aphorism.model';

@Entity('aphorism')
export class AphorismEntity extends BaseEntity implements Aphorism {

  @ObjectIdColumn()
  _id!: ObjectID;

  @IsNotEmpty()
  @Column({ unique: true })
  id!: number;

  @Length(1, 255)
  @Column()
  @Index()
  author!: string;

  @Length(6, 255)
  @Column()
  content!: string;

  @IsDate()
  @Column()
  date!: Date;

  @Column({ default: 0 })
  like!: number;

}
