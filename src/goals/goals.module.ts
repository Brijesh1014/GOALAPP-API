import { Module } from "@nestjs/common";
import { GoalsService } from "./goals.service";
import { GoalsController } from "./goals.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GoalsEntity } from "./entities/goals.entity";
import { TasksEntity } from "../tasks/entities/tasks.entity";

@Module({
  imports: [TypeOrmModule.forFeature([GoalsEntity, TasksEntity])],
  providers: [GoalsService],
  controllers: [GoalsController],
})
export class GoalsModule {}
