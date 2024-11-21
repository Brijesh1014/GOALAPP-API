import { Dayjs } from 'dayjs';

export enum TaskStatus {
  UnChecked = 'UnChecked',
  Checked = 'Checked',
}

export interface ITask {
  id: string;
  name: string;
  description: string;
  goal_id: string;
  status: TaskStatus;
  created_at: Dayjs;
  checked_at: Dayjs;
}

export interface CreateTask {
  name: string;
  description: string;
  goal_id: string;
}
