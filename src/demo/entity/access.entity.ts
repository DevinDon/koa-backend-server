import { IsDate, IsIP, Length } from 'class-validator';
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('access')
export class AccessEntity extends BaseEntity {

  @ObjectIdColumn()
  _id!: ObjectID;

  @Length(3, 10)
  @Column()
  method!: string;

  @Column()
  url!: string;

  @Column({ nullable: true })
  params?: string;

  @IsDate()
  @Column()
  datetime!: Date;

  @IsIP()
  @Column()
  ip!: string;

}
