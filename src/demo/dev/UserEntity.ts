import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export interface User {
  username: string;
  password: string;
}

@Entity('user')
export class UserEntity extends BaseEntity implements User {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  password!: string;

}
