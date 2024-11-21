import dayjs from "dayjs";
import { GoalsEntity } from "../../goals/entities/goals.entity";
import { TaskStatus } from "../../types/tasks/ITasks";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "tasks" })
export class TasksEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: "" })
  ref: string;

  @Column()
  name: string;

  @Column({ default: "" })
  description: string;

  @ManyToOne(() => GoalsEntity, (goal) => goal.id, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "goal_id" })
  goal: GoalsEntity;

  @Column()
  goal_id: string;

  @Column({ default: TaskStatus.UnChecked })
  status: TaskStatus;

  @Column({ default: () => `'${dayjs().toISOString()}'` })
  created_at: string;

  @Column({ nullable: true })
  checked_at: string;
}
