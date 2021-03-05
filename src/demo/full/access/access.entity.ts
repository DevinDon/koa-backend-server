import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from '../../../main/declares/typeorm';
import { IsDate, IsIP, Length } from '../../../main/declares/validator';

@Entity('access')
export class AccessEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

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
