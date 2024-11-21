// src/types/express/index.d.ts

import 'express';
import { UsersEntity } from 'src/users/entities/users.entity';

declare module 'express' {
  export interface Request {
    user?: UsersEntity;
  }
}
