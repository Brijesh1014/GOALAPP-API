import dayjs from 'dayjs';
import { TasksEntity } from 'src/tasks/entities/tasks.entity';
import { GoalStatus } from 'src/types/goals/IGoal';
import { UsersEntity } from 'src/users/entities/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'goals' })
export class GoalsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: '' })
  description: string;

  @ManyToOne(() => UsersEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @Column()
  user_id: string;

  @Column({ default: GoalStatus.InActive })
  status: GoalStatus;

  @Column({ default: '' })
  start_duration: string;

  @Column({ default: '' })
  end_duration: string;

  @Column({ nullable: true })
  theme: string;

  @OneToMany(() => TasksEntity, (task) => task.goal)
  tasks: TasksEntity[];

  @Column({ default: () => `'${dayjs().toISOString()}'` })
  created_at: string;

  @Column({ default: () => `'${dayjs().toISOString()}'` })
  updated_at: string;
}
