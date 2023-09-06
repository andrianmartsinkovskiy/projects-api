import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import { Project } from "../entities/project.entity";
import { AddTaskDto } from "../dto/add-task.dto";
import { Task } from "../entities/task.entity";
import { AddUserToProjectDto } from "../dto/add-user-to-project.dto";
import { RemoveUserFromProjectDto } from "../dto/remove-user-from-project.dto";
import { EditProjectDto } from "../dto/edit-project.dto";
import { AssignTaskDto } from "../dto/assign-task.dto";
import { ChangeTaskStatusDto } from "../dto/change-task-status.dto";
import { EditTaskDto } from "../dto/edit-task.dto";

@Injectable()
export class ProjectService {
  private project: string;
  constructor(
    @InjectRepository(User) private user_repository: Repository<User>,
    @InjectRepository(Project) private project_repository: Repository<Project>,
    @InjectRepository(Task) private task_repository: Repository<Task>,
  ) {}

  async getByUser(id: number) {
    return await this.project_repository
      .createQueryBuilder('project')
      .leftJoin('project.owner', 'owner')
      .where('project.owner.id = :id', { id })
      .orderBy('project.created_at', 'DESC')
      .getMany();
  }

  async addProject(name: string, userId: number) {
    const user = await this.user_repository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const newProject = new Project();
    newProject.name = name;
    newProject.owner = user;
    newProject.users = [user];
    const savedProject = await this.project_repository.save(newProject);

    return {
      message: 'Project successfully created',
      project: savedProject,
    };
  }

  async addUserToProject(dto: AddUserToProjectDto) {
    const project = await this.project_repository.findOne({
      where: { id: dto.projectId },
    });
    if (project) {
      throw new BadRequestException('Project not found');
    }

    const user = await this.user_repository.findOne({
      where: { id: dto.userId },
    });
    if (user) {
      throw new BadRequestException('User not found');
    }

    project.users = [...project.users, user];
    await this.project_repository.save(project);

    return {
      message: 'User successfully added to project',
    };
  }

  async removeUserFromProject(dto: RemoveUserFromProjectDto) {
    const project = await this.project_repository.findOne({
      where: { id: dto.projectId },
    });
    if (project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    const user = await this.user_repository.findOne({
      where: { id: dto.userId },
    });
    if (user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (project.owner.id === user.id) {
      throw new HttpException('You cant delete owner', HttpStatus.BAD_REQUEST);
    }

    project.users = project.users.filter((item) => item.id !== dto.userId);
    await this.project_repository.save(project);

    return {
      message: 'User successfully removed from project',
    };
  }

  async removeProject(id: number) {
    const project = await this.project_repository.findOne({ where: { id } });
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    const tasks = await this.task_repository.find({ where: { project } });
    if (tasks.length) {
      await this.task_repository.remove(tasks);
    }

    await this.project_repository.remove(project);

    return {
      message: 'Project successfully remove',
      id: id,
    };
  }

  async addTask(dto: AddTaskDto) {
    const project = await this.project_repository.findOne({
      where: { id: dto.projectId },
    });
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    const newTask = new Task();
    newTask.project = project;
    newTask.title = dto.title;

    await this.task_repository.save(newTask);

    return {
      message: 'Task successfully added',
    };
  }

  async editProject(dto: EditProjectDto) {
    const project = await this.project_repository.findOne({
      where: { id: dto.projectId },
    });
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    project.name = dto.name;

    const savedProject = await this.project_repository.save(project);

    return {
      project: savedProject,
      message: 'Project successfully edited',
    };
  }

  async assignTask(dto: AssignTaskDto) {
    let user: User | null;
    if (dto.userId !== -1) {
      const userData = await this.user_repository.findOne({
        where: { id: dto.userId },
      });
      if (!userData) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      user = !!userData ? userData : null;
    }

    const task = await this.task_repository.findOne({
      where: { id: dto.taskId },
    });
    if (!task) {
      throw new HttpException('task not found', HttpStatus.NOT_FOUND);
    }

    task.user = user;
    const savedTask = await this.task_repository.save(task);

    return {
      task: savedTask,
      message: 'Task successfully edited',
    };
  }

  async changeTaskStatus(dto: ChangeTaskStatusDto) {
    const task = await this.task_repository.findOne({
      where: { id: dto.taskId },
    });
    if (!task) {
      throw new HttpException('task not found', HttpStatus.NOT_FOUND);
    }
    task.isDone = dto.isDone;

    const savedTask = await this.task_repository.save(task);

    return {
      task: savedTask,
      message: 'Task status successfully edited',
    };
  }

  async editTask(dto: EditTaskDto) {
    const task = await this.task_repository.findOne({
      where: { id: dto.taskId },
    });
    if (!task) {
      throw new HttpException('task not found', HttpStatus.NOT_FOUND);
    }
    task.title = dto.title;

    const savedTask = await this.task_repository.save(task);

    return {
      task: savedTask,
      message: 'Task successfully edited',
    };
  }

  async removeTask(id: number) {
    const task = await this.task_repository.findOne({
      where: { id },
    });
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    await this.task_repository.remove(task);

    return {
      message: 'Task successfully removed',
    };
  }

  async getTasksByProject(id: number) {
    const project = await this.project_repository.findOne({ where: { id } });
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    console.log(1);
    return await this.task_repository.find({ where: { project } });
  }

  async getProjectData(projectId: number) {
    return await this.project_repository
      .createQueryBuilder('project')
      .where('project.id = :id', { id: projectId })
      .leftJoin('project.owner', 'owner')
      .leftJoin('project.users', 'users')
      .addSelect(['owner.id', 'owner.login'])
      .addSelect(['users.id', 'users.login'])
      .getOne();
  }
}
