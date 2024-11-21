export enum GoalStatus {
  InActive = 'InActive',
  Active = 'Active',
  PartiallyCompleted = 'PartiallyCompleted',
  Completed = 'Completed',
  Scheduled = 'Scheduled',
}

export interface IGoal {
  id: string;
  name: string;
  description: string;
  user_id: string;
  status: GoalStatus;
  start_duration: string;
  end_duration: string;
  theme: string;
  created_at: string;
  updated_at: string;
}

export type CreateGoal = {
  name: string;
  description: string;
  start_duration: string;
  end_duration: string;
  theme: string;

  tasks: { name: string; description: string }[];
};
