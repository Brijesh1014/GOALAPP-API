import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksEntity } from './entities/tasks.entity';
import { GoalsEntity } from 'src/goals/entities/goals.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TasksEntity, GoalsEntity])],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
