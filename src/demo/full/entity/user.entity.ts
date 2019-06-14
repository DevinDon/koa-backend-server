import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Interface user.
 *
 * - id: number
 * - email: string
 * - nickname: string
 * - password: string
 * - motto?: string
 */
export interface User {
  /** User ID. */
  id: number;
  /** User email. */
  email: string;
  /** User nickname. */
  nickname?: string;
  /** User password. */
  password: string;
  /** User motto, nullable. */
  motto?: string;
}

/**
 * User entity.
 */
@Entity('users')
export class UserEntity extends BaseEntity implements User {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column({
    nullable: true
  })
  nickname?: string;

  @Column()
  password!: string;

  @Column({
    nullable: true
  })
  motto?: string;

}
