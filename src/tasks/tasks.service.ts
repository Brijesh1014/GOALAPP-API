import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksEntity } from './entities/tasks.entity';
import { Repository } from 'typeorm';
import { CreateTask, TaskStatus } from 'src/types/tasks/ITasks';
import { GoalsEntity } from 'src/goals/entities/goals.entity';
import dayjs from 'dayjs';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksEntity)
    private tasksRepository: Repository<TasksEntity>,

    @InjectRepository(GoalsEntity)
    private goalsRepository: Repository<GoalsEntity>,
  ) {}

  async allTasks() {
    return await this.tasksRepository.find();
  }

  async createTask(payload: CreateTask) {
    const { name, description, goal_id } = payload;
    if (!name) {
      throw new BadRequestException('Task name is mandatory');
    }

    const goal = await this.goalsRepository.findOne({ where: { id: goal_id } });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    const taskObject = this.tasksRepository.create({
      name,
      description,
      status: TaskStatus.UnChecked,
      goal,
    });

    const task = await this.tasksRepository.save(taskObject);

    return {
      message: 'Task successfully created',
      error: null,
      statusCode: HttpStatus.CREATED,
      data: task,
    };
  }

  async updateTask(taskId: string, refId: string, payload: CreateTask) {
    const { name, description, goal_id } = payload;

    if (!name) {
      throw new BadRequestException('Task name is mandatory');
    }

    if (!goal_id) {
      throw new BadRequestException('Goal id is required');
    }

    const task = await this.tasksRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const updateStatus = await this.tasksRepository.update(
      // Ref is used to find out exactly tasks which user wants to update
      { ref: refId, goal: { id: goal_id } },
      { name, description },
    );

    return {
      message: 'Task updated',
      error: null,
      statusCode: HttpStatus.OK,
      data: updateStatus.affected,
    };
  }

  async updateTaskStatus(taskId: string, status: TaskStatus) {
    if (status !== TaskStatus.Checked && status !== TaskStatus.UnChecked) {
      throw new BadRequestException('Invalid status');
    }

    const task = await this.tasksRepository.findOne({
      where: { id: taskId },
      relations: ['goal'],
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.tasksRepository.update(
      { id: taskId },
      {
        status: status,
        checked_at:
          status === TaskStatus.Checked ? dayjs().toISOString() : null,
      },
    );
    return {
      message: `Task ${status}`,
      error: null,
      statusCode: HttpStatus.OK,
      data: {
        goal_id: task.goal.id,
        status,
      },
    };
  }

  async deleteTask(taskId: string) {
    const task = await this.tasksRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    await this.tasksRepository.delete({ id: taskId });
    return {
      message: 'Task deleted',
      error: null,
      statusCode: HttpStatus.OK,
      data: 'OK',
    };
  }
}
