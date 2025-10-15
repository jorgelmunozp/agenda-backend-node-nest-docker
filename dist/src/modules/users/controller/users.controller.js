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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../service/users.service");
const dotenv = __importStar(require("dotenv"));
const mongodb_1 = require("mongodb");
const jwt_encode_1 = __importDefault(require("jwt-encode"));
const jwtSecretKey = process.env.JWT_SECRET ?? '';
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
            throw new common_1.BadRequestException('UsernameX is required');
        if (!body.password)
            throw new common_1.BadRequestException('Password is required');
        const userData = {
            name: body.name,
            email: body.email,
            username: (0, jwt_encode_1.default)(body.username, jwtSecretKey),
            password: (0, jwt_encode_1.default)(body.password, jwtSecretKey),
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
    async recoverPassword(body) {
        if (!body.email)
            throw new common_1.BadRequestException('Email is requeired');
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
//# sourceMappingURL=users.controller.js.map