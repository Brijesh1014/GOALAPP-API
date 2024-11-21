import { Dayjs } from 'dayjs';

export interface IUser {
  id: string;
  email: string;
  password: string;
  email_verified: boolean;
  user_name: string;
  display_name: string;
  photo: string;
  created_at: Dayjs;
  updated_at: Dayjs;
}

export interface CreateUser {
  email: string;
  password: string;
  user_name: string;
  photo?: string;
  display_name: string;
}
