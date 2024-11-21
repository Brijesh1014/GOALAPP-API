import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoal } from 'src/types/goals/IGoal';
import { Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller({
  path: 'goals',
  version: '1',
})
@UseGuards(AuthGuard)
export class GoalsController {
  constructor(private goalsService: GoalsService) {}

  @Get(':id')
  getGoalWithTasks(@Param('id') goalId: string) {
    return this.goalsService.getGoalWithTasks(goalId);
  }

  @Get(':id/tasks')
  getTasksByGoalId(@Param('id') taskId: string, @Query('date') date: string) {
    return this.goalsService.getTasksByGoalId(taskId, date);
  }

  @Post()
  createUserGoal(@Body() payload: CreateGoal, @Req() request: Request) {
    return this.goalsService.createUserGoal(payload, request);
  }

  @Get()
  getUserGoals(@Req() request: Request) {
    return this.goalsService.getUserGoals(request);
  }

  @Put(':id/theme/:colorId')
  updateGoalTheme(@Param('id') id: string, @Param('colorId') colorId: string) {
    return this.goalsService.updateGoalTheme(id, colorId);
  }

  @Delete(':id')
  deleteGoal(@Param('id') goalId: string) {
    return this.goalsService.deleteGoal(goalId);
  }
}
