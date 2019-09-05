import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface User {
  id: number;
  name: string;
  password: string;
  total: number;
}

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
