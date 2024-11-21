import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GoalsEntity } from "./entities/goals.entity";
import { Repository } from "typeorm";
import { CreateGoal, GoalStatus } from "../types/goals/IGoal";
import dayjs from "dayjs";
import { Request } from "express";
import { TasksEntity } from "../tasks/entities/tasks.entity";

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(GoalsEntity)
    private goalsRepository: Repository<GoalsEntity>,
    @InjectRepository(TasksEntity)
    private tasksRepository: Repository<TasksEntity>
  ) {}

  async getGoalWithTasks(goalId: string) {
    const goal = await this.goalsRepository.findOne({
      where: { id: goalId },
      relations: { tasks: true },
    });
    if (!goal) {
      throw new NotFoundException("Goal not found");
    }

    return {
      message: "Success",
      error: null,
      statusCode: HttpStatus.OK,
      data: goal,
    };
  }

  async getTasksByGoalId(goalId: string, date?: string) {
    const goal = await this.goalsRepository.findOne({ where: { id: goalId } });
    if (!goal) {
      throw new NotFoundException("Goal not found");
    }

    if (dayjs(date).isBefore(goal.start_duration)) {
      throw new NotFoundException(
        "Your goal will be started from " +
          dayjs(goal.start_duration).format("MMM DD")
      );
    }

    if (dayjs(date).isAfter(goal.end_duration)) {
      throw new NotFoundException("You don't have tasks for this period");
    }

    const tasks = await this.tasksRepository.find({
      where: { goal: { id: goalId }, created_at: date },
      order: { name: "DESC" },
    });

    return {
      message: "Success",
      error: null,
      statusCode: HttpStatus.OK,
      data: {
        ...goal,
        tasks,
      },
    };
  }
  async createUserGoal(payload: CreateGoal, request: Request) {
    const activeUser = request.user;

    const { name, description, start_duration, end_duration, theme, tasks } =
      payload;

    if (!name || !start_duration || !end_duration) {
      throw new BadRequestException("Missing required properties");
    }

    if (!Array.isArray(tasks)) {
      throw new BadRequestException("Missing required properties [tasks]");
    }

    const isValidStartDuration = dayjs(start_duration).isValid();
    const isValidEndDuration = dayjs(end_duration).isValid();

    if (!isValidStartDuration || !isValidEndDuration) {
      throw new BadRequestException("Invalid duration");
    }

    let goalStatus = GoalStatus.InActive;
    const today = dayjs();
    const startDate = dayjs(start_duration);
    const endDate = dayjs(end_duration);

    if (today.isBefore(startDate)) {
      goalStatus = GoalStatus.Scheduled;
    } else if (today.isAfter(endDate)) {
      goalStatus = GoalStatus.Completed;
    } else {
      goalStatus = GoalStatus.Active;
    }

    const goalObject = this.goalsRepository.create({
      name,
      description,
      start_duration,
      end_duration,
      user: activeUser,
      theme,
      status: goalStatus,
    });

    const goal = await this.goalsRepository.save(goalObject);

    let current = startDate;

    const allTasks = [];

    while (current.isBefore(endDate) || current.isSame(endDate, "day")) {
      const taskPromise = await Promise.all(
        tasks.map(async (task, index) => {
          const { name, description } = task;
          const taskObject = this.tasksRepository.create({
            name,
            description,
            goal,
            created_at: current.format("YYYY-MM-DD"),
            // Useful to update tasks
            ref: index.toString(),
          });
          return await this.tasksRepository.save(taskObject);
        })
      );

      allTasks.push(...taskPromise);
      current = current.add(1, "day"); // Increment by 1 day
    }

    return {
      message: "Goal successfully added",
      statusCode: HttpStatus.CREATED,
      data: goal,
      error: null,
    };
  }

  async getUserGoals(request: Request) {
    const activeUser = request.user;

    const userGoals = await this.goalsRepository.find({
      //   select: { user: { display_name: true } },
      where: { user: { id: activeUser.id } },
      //   relations: { user: true },
    });

    return {
      message: "User goals",
      error: null,
      statusCode: HttpStatus.OK,
      data: userGoals,
    };
  }

  async updateGoalTheme(id: string, theme: string) {
    const goal = await this.goalsRepository.findOne({ where: { id } });
    if (goal) {
      await this.goalsRepository.update({ id }, { theme: "#" + theme });
      return {
        message: "Theme updated",
        error: null,
        statusCode: HttpStatus.OK,
        data: {
          goalId: goal.id,
        },
      };
    }
    throw new NotFoundException("Goal not found");
  }

  async deleteGoal(goalId: string) {
    await this.goalsRepository.delete({ id: goalId });

    return {
      message: "Your Goal has been deleted",
      error: null,
      statusCode: HttpStatus.OK,
      data: "Delete",
    };
  }
}
