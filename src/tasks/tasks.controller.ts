import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTask, TaskStatus } from "../types/tasks/ITasks";

@Controller({
  path: "tasks",
  version: "1",
})
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get("/all")
  allTasks() {
    return this.taskService.allTasks();
  }

  @Post()
  createTask(@Body() payload: CreateTask) {
    return this.taskService.createTask(payload);
  }

  @Put(":id/status/:statusId")
  updateTaskStatus(
    @Param("id") taskId: string,
    @Param("statusId") status: TaskStatus
  ) {
    return this.taskService.updateTaskStatus(taskId, status);
  }

  @Put(":id/ref/:refId")
  updateTask(
    @Param("id") taskId: string,
    @Param("refId") refId: string,
    @Body() payload: CreateTask
  ) {
    return this.taskService.updateTask(taskId, refId, payload);
  }

  @Delete(":id")
  deleteTask(@Param("id") taskId: string) {
    return this.taskService.deleteTask(taskId);
  }
}
