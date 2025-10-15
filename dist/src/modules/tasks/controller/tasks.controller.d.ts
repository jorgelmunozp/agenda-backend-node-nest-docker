import { UsersService } from '../../users/service/users.service';
import { TasksService } from '../../tasks/service/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
export declare class TasksController {
    private readonly tasksService;
    private readonly usersService;
    constructor(tasksService: TasksService, usersService: UsersService);
    addTaskToUser(id: string, taskDto: CreateTaskDto): Promise<{
        message: string;
        user?: undefined;
    } | {
        message: string;
        user: import("mongodb").WithId<import("bson").Document>;
    }>;
    getAllTasks(userId: string): Promise<any>;
    getTaskById(userId: string, taskId: string): Promise<any>;
    completeTask(userId: string, taskId: string): Promise<string>;
    private ensureValidObjectId;
}
