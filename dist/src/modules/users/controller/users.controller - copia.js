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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../service/users.service");
const dotenv = __importStar(require("dotenv"));
const mongodb_1 = require("mongodb");
const create_task_dto_1 = require("../dto/create-task.dto");
const create_reminder_dto_1 = require("../dto/create-reminder.dto");
dotenv.config();
const db = 'users';
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getAllUsers() {
        return this.usersService.getAll();
    }
    async getById(id) {
        this.ensureValidObjectId(id);
        return this.usersService.getById(id);
    }
    async addUser(body) {
        if (!body.name)
            throw new common_1.BadRequestException('Name is required');
        if (!body.email)
            throw new common_1.BadRequestException('Email is required');
        if (!body.username)
            throw new common_1.BadRequestException('Username is required');
        if (!body.password)
            throw new common_1.BadRequestException('Password is required');
        const userData = {
            name: body.name,
            email: body.email,
            username: body.username,
            password: body.password,
            tasks: Array.isArray(body.tasks) ? body.tasks : [],
            reminders: Array.isArray(body.reminders) ? body.reminders : []
        };
        const existingData = await this.usersService.findByEmailOrUsername(body.email, body.username);
        if (existingData) {
            let message = 'The following fields already exist: ';
            if (existingData.email)
                message += 'email ';
            if (existingData.username)
                message += 'username';
            throw new common_1.BadRequestException(message.trim());
        }
        console.log("User successfully registered:", userData);
        return this.usersService.create(userData);
    }
    async deleteUser(id) {
        this.ensureValidObjectId(id);
        return this.usersService.delete(id);
    }
    async patchUser(id, body) {
        this.ensureValidObjectId(id);
        return this.usersService.patch(id, body);
    }
    async updateUser(id, body) {
        this.ensureValidObjectId(id);
        if (!body.name)
            throw new common_1.BadRequestException('Name is required');
        return this.usersService.update(id, body);
    }
    async addTaskToUser(id, taskDto) {
        this.ensureValidObjectId(id);
        if (!taskDto.name || !taskDto.time || !taskDto.date) {
            throw new common_1.BadRequestException('The task must have a name, date and time');
        }
        const updatedUser = await this.usersService.addTask(id, taskDto);
        if (!updatedUser) {
            throw new common_1.NotFoundException(`No user with id found ${id}`);
        }
        console.log(`New task added to user ${id}:`, JSON.stringify(taskDto, null, 2));
        return updatedUser;
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
        const updatedTask = await this.usersService.completeTask(userId, taskId);
        if (!updatedTask) {
            throw new common_1.NotFoundException(`No task with id ${taskId} found for user ${userId}`);
        }
        console.log(`Task ${taskId} for user ${userId} marked as completado:`, updatedTask);
        return updatedTask;
    }
    async addReminderToUser(id, reminderDto) {
        this.ensureValidObjectId(id);
        if (!reminderDto.name || !reminderDto.time || !reminderDto.date) {
            throw new common_1.BadRequestException('The reminder must have a name, date and time');
        }
        const updatedUser = await this.usersService.addReminder(id, reminderDto);
        if (!updatedUser) {
            throw new common_1.NotFoundException(`No user with id found ${id}`);
        }
        console.log(`New reminder added to user ${id}:`, JSON.stringify(reminderDto, null, 2));
        return updatedUser;
    }
    async getReminderById(userId, reminderId) {
        this.ensureValidObjectId(userId);
        const user = await this.usersService.getById(userId);
        if (!user) {
            throw new common_1.NotFoundException(`No user with id found ${userId}`);
        }
        const reminder = user.user.reminders.find((r) => r.id === reminderId);
        if (!reminder) {
            throw new common_1.NotFoundException(`No reminder with id found ${reminderId} for user ${userId}`);
        }
        return reminder;
    }
    async completeReminder(userId, reminderId) {
        this.ensureValidObjectId(userId);
        const updatedReminder = await this.usersService.completeReminder(userId, reminderId);
        if (!updatedReminder) {
            throw new common_1.NotFoundException(`No task with id ${reminderId} found for user ${userId}`);
        }
        console.log(`Task ${reminderId} for user ${userId} marked as completado:`, updatedReminder);
        return updatedReminder;
    }
    async recoverPassword(body) {
        if (!body.email)
            throw new common_1.BadRequestException('Email is requested');
        return this.usersService.sendPasswordRecoveryEmail(body.email);
    }
    ensureValidObjectId(id) {
        if (!mongodb_1.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`The provided id is not a valid ObjectId: ${id}`);
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addUser", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "patchUser", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Post)(':id/tasks'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_task_dto_1.CreateTaskDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addTaskToUser", null);
__decorate([
    (0, common_1.Get)(':userId/tasks/:taskId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getTaskById", null);
__decorate([
    (0, common_1.Patch)(':userId/tasks/:taskId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "completeTask", null);
__decorate([
    (0, common_1.Post)(':id/reminders'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_reminder_dto_1.CreateReminderDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addReminderToUser", null);
__decorate([
    (0, common_1.Get)(':userId/reminders/:reminderId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('reminderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getReminderById", null);
__decorate([
    (0, common_1.Patch)(':userId/reminders/:reminderId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('reminderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "completeReminder", null);
__decorate([
    (0, common_1.Post)('recover-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "recoverPassword", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)(db),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller%20-%20copia.js.map