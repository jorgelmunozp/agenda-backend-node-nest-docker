"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../users/service/users.service");
const tasks_service_1 = require("../../tasks/service/tasks.service");
const dotenv = __importStar(require("dotenv"));
const mongodb_1 = require("mongodb");
const create_task_dto_1 = require("../dto/create-task.dto");
const jwtSecretKey = process.env.JWT_SECRET ?? '';
dotenv.config();
const db = 'users';
let TasksController = class TasksController {
    constructor(tasksService, usersService) {
        this.tasksService = tasksService;
        this.usersService = usersService;
    }
    async addTaskToUser(id, taskDto) {
        this.ensureValidObjectId(id);
        if (!taskDto.name || !taskDto.time || !taskDto.date) {
            throw new common_1.BadRequestException('The task must have a name, date and time');
        }
        const updatedUser = await this.tasksService.addTask(id, taskDto);
        if (!updatedUser) {
            throw new common_1.NotFoundException(`No user with id found ${id}`);
        }
        console.log(`New task added to user ${id}:`, JSON.stringify(taskDto, null, 2));
        return updatedUser;
    }
    async getAllTasks(userId) {
        this.ensureValidObjectId(userId);
        const user = await this.usersService.getById(userId);
        if (!user) {
            throw new common_1.NotFoundException(`No user with id found ${userId}`);
        }
        const tasks = user.user.tasks;
        if (!tasks || tasks.length === 0) {
            throw new common_1.NotFoundException(`No tasks found for user ${userId}`);
        }
        return tasks;
    }
    async getTaskById(userId, taskId) {
        this.ensureValidObjectId(userId);
        const user = await this.usersService.getById(userId);
        if (!user) {
            throw new common_1.NotFoundException(`No user with id found ${userId}`);
        }
        const task = user.user.tasks.find((t) => t.id === taskId);
        if (!task) {
            throw new common_1.NotFoundException(`No task with id found ${taskId} for user ${userId}`);
        }
        return task;
    }
    async completeTask(userId, taskId) {
        this.ensureValidObjectId(userId);
        const updatedTask = await this.tasksService.completeTask(userId, taskId);
        if (!updatedTask) {
            throw new common_1.NotFoundException(`No task with id ${taskId} found for user ${userId}`);
        }
        console.log(`Task ${taskId} for user ${userId} marked as completado:`, updatedTask);
        return updatedTask;
    }
    ensureValidObjectId(id) {
        if (!mongodb_1.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`The provided id is not a valid ObjectId: ${id}`);
        }
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Post)(':id/tasks'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_a = typeof create_task_dto_1.CreateTaskDto !== "undefined" && create_task_dto_1.CreateTaskDto) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "addTaskToUser", null);
__decorate([
    (0, common_1.Get)(':userId/tasks'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "getAllTasks", null);
__decorate([
    (0, common_1.Get)(':userId/tasks/:taskId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "getTaskById", null);
__decorate([
    (0, common_1.Patch)(':userId/tasks/:taskId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "completeTask", null);
exports.TasksController = TasksController = __decorate([
    (0, common_1.Controller)(db),
    __metadata("design:paramtypes", [tasks_service_1.TasksService, users_service_1.UsersService])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map