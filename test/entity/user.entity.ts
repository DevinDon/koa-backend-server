import { Entity, PrimaryGeneratedColumn, Column, Timestamp, BaseEntity } from 'typeorm';

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    comment: 'User ID'
  })
  id: number;

  @Column({
    type: 'char',
    width: 64,
    comment: 'User Name'
  })
  name: string;

  @Column({
    type: 'char',
    width: 64,
    comment: 'User Password'
  })
  password: string;

  @Column({
    type: 'tinyint',
    default: false,
    comment: 'Account is disabled or not'
  })
  disable: boolean;

  @Column({
    type: 'int',
    default: 0
  })
  value: number;

}

export default User;
