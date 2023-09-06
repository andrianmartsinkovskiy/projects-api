import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from '../auth/guards/role.guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../types/user-roles.type';
import { Request, Response } from 'express';
import { ProjectService } from './project.service';
import { AddTaskDto } from '../dto/add-task.dto';
import { AddProjectDto } from '../dto/add-project.dto';
import { AddUserToProjectDto } from '../dto/add-user-to-project.dto';
import { RemoveUserFromProjectDto } from '../dto/remove-user-from-project.dto';
import { EditProjectDto } from '../dto/edit-project.dto';
import { AssignTaskDto } from '../dto/assign-task.dto';
import { ChangeTaskStatusDto } from '../dto/change-task-status.dto';
import { EditTaskDto } from '../dto/edit-task.dto';
import { IGetUserAuthInfoRequest } from "../types/user-request.interface";

@Controller('project')
export class ProjectController {
  constructor(private project_service: ProjectService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @Get('/getByUser/:id')
  async getByUser(@Res() res: Response, @Param('id') id: string) {
    const projects = await this.project_service.getByUser(Number(id));

    res.json(projects);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @Post('/addProject')
  async addProject(
    @Res() res: Response,
    @Req() req: IGetUserAuthInfoRequest,
    @Body() dto: AddProjectDto,
  ) {
    console.log(req.user, 'req.user.userId');
    const data = await this.project_service.addProject(
      dto.name,
      req.user.id,
    );

    res.json(data);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @Post('/editProject')
  async editProject(
    @Res() res: Response,
    @Req() req: Request,
    @Body() dto: EditProjectDto,
  ) {
    const data = await this.project_service.editProject(dto);

    res.json(data);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @Get('/addUserToProject')
  async addUserToProject(
    @Res() res: Response,
    @Req() req: Request,
    @Body() dto: AddUserToProjectDto,
  ) {
    const data = await this.project_service.addUserToProject(dto);

    res.json(data);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @Get('/removeUserFromProject')
  async removeUserFromProject(
    @Res() res: Response,
    @Req() req: Request,
    @Body() dto: RemoveUserFromProjectDto,
  ) {
    const data = await this.project_service.removeUserFromProject(dto);

    res.json(data);
  }
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @Delete('/removeProject/:id')
  async removeProject(@Res() res: Response, @Param('id') id: string) {
    const data = await this.project_service.removeProject(Number(id));

    res.json(data);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @Get('/addTask')
  async addTask(@Res() res: Response, @Body() dto: AddTaskDto) {
    const data = await this.project_service.addTask(dto);

    res.json(data);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @Post('/assignTask')
  async assignTask(@Res() res: Response, @Body() dto: AssignTaskDto) {
    const data = await this.project_service.assignTask(dto);

    res.json(data);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @Post('/changeTaskStatus')
  async changeTaskStatus(
    @Res() res: Response,
    @Body() dto: ChangeTaskStatusDto,
  ) {
    const data = await this.project_service.changeTaskStatus(dto);

    res.json(data);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @Post('/editTask')
  async editTask(@Res() res: Response, @Body() dto: EditTaskDto) {
    const data = await this.project_service.editTask(dto);

    res.json(data);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @Delete('/removeTask/:id')
  async removeTask(@Res() res: Response, @Param('id') id: string) {
    const data = await this.project_service.removeTask(Number(id));

    res.json(data);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @Get('/getProjectData/:id')
  async getProjectData(@Res() res: Response, @Param('id') id: string) {
    const projects = await this.project_service.getProjectData(Number(id));

    res.json(projects);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @Get('/getTasksByProject/:id')
  async getTasksByProject(@Res() res: Response, @Param('id') id: string) {
    const projects = await this.project_service.getTasksByProject(Number(id));

    res.json(projects);
  }
}
