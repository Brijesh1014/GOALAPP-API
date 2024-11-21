import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import dayjs from 'dayjs';

@Entity({ name: 'users' })
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  email_verified: boolean;

  @Column()
  user_name: string;

  @Column({ default: '', nullable: true })
  display_name: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ default: () => `'${dayjs().toISOString()}'` })
  created_at: string;

  @Column({ default: () => `'${dayjs().toISOString()}'` })
  updated_at: string;
}
