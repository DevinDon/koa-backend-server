import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.model';

@Entity('user')
export class UserEntity extends BaseEntity implements User {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column({
    default: 0
  })
  total!: number;

}
