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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let UsersController = class UsersController {
    constructor() {
        this.dataFile = path.resolve(process.cwd(), 'src/users/data.json');
    }
    readData() {
        if (fs.existsSync(this.dataFile)) {
            return JSON.parse(fs.readFileSync(this.dataFile, 'utf8'));
        }
        return { users: [] };
    }
    writeData(data) {
        fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
    }
    getAllUsers() {
        const fileContent = this.readData();
        return fileContent.users || [];
    }
    getById(id) {
        const data = this.readData();
        const record = data.users.find((u) => Number(u.id) === Number(id));
        if (!record)
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        return record;
    }
    addUser(body) {
        const { name, id } = body;
        if (!name || typeof id !== 'number') {
            throw new common_1.BadRequestException('Name (string) and id (number) are required');
        }
        const data = this.readData();
        const newRecordId = data.users.length
            ? Number(data.users[data.users.length - 1].id) + 1
            : 1;
        const newUser = {
            user: { name, id },
            id: newRecordId
        };
        data.users.push(newUser);
        this.writeData(data);
        return { message: 'User added successfully', user: newUser };
    }
    deleteUser(id) {
        const data = this.readData();
        const index = data.users.findIndex((u) => Number(u.id) === Number(id));
        if (index === -1) {
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
        const deletedUser = data.users.splice(index, 1)[0];
        this.writeData(data);
        return { message: 'User deleted successfully', user: deletedUser };
    }
    patchUser(id, body) {
        const data = this.readData();
        const index = data.users.findIndex((u) => Number(u.id) === Number(id));
        if (index === -1) {
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
        data.users[index].user = { ...data.users[index].user, ...body };
        this.writeData(data);
        return { message: 'User updated partially', user: data.users[index] };
    }
    updateUser(id, body) {
        const { name, id: userId } = body;
        if (!name || typeof userId !== 'number') {
            throw new common_1.BadRequestException('Name (string) and userId (number) are required');
        }
        const data = this.readData();
        const index = data.users.findIndex((u) => Number(u.id) === Number(id));
        if (index === -1) {
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
        data.users[index] = {
            user: { name, id: userId },
            id: Number(id)
        };
        this.writeData(data);
        return { message: 'User updated completely', user: data.users[index] };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "addUser", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "patchUser", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateUser", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users')
], UsersController);
//# sourceMappingURL=users.controller.js.map