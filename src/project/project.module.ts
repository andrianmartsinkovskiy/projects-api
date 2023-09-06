import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { Project } from '../entities/project.entity';
import { Task } from '../entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project, Task])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
