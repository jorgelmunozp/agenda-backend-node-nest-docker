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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const connectDB_1 = require("../../../database/connectDB");
const mongodb_1 = require("mongodb");
const dotenv = __importStar(require("dotenv"));
const nodemailer = __importStar(require("nodemailer"));
dotenv.config();
const dbCollection = 'user';
let UsersService = class UsersService {
    constructor() {
        this.collectionName = dbCollection;
    }
    async getCollection() {
        const db = await (0, connectDB_1.connectDB)();
        return db.collection(this.collectionName);
    }
    async getAll() {
        const collection = await this.getCollection();
        return collection.find().toArray();
    }
    async getById(id) {
        const collection = await this.getCollection();
        const doc = await collection.findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!doc)
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        return doc;
    }
    async create(createUserDto) {
        const collection = await this.getCollection();
        const newUser = { user: createUserDto };
        const result = await collection.insertOne(newUser);
        return { message: 'User created successfully', _id: result.insertedId, ...newUser };
    }
    async delete(id) {
        const collection = await this.getCollection();
        const result = await collection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
        return { message: 'User deleted successfully' };
    }
    async update(id, body) {
        const collection = await this.getCollection();
        const result = await collection.replaceOne({ _id: new mongodb_1.ObjectId(id) }, { user: body });
        if (result.matchedCount === 0) {
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
        return { message: 'User updated completely', user: { _id: id, ...body } };
    }
    async patch(id, body) {
        const collection = await this.getCollection();
        const result = await collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { user: body } });
        if (result.matchedCount === 0) {
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
        return { message: 'User updated partially' };
    }
    async addTask(userId, task) {
        const collection = await this.getCollection();
        const objectId = new mongodb_1.ObjectId(userId);
        const userDoc = await collection.findOne({ _id: objectId });
        if (!userDoc) {
            throw new common_1.NotFoundException(`User with id ${userId} not found`);
        }
        const taskId = "t" + ((userDoc.user?.tasks?.length ?? 0) + 1);
        const result = await collection.updateOne({ _id: objectId }, { $push: { "user.tasks": { task: { ...task, completed: false }, id: taskId } } });
        if (result.matchedCount === 0) {
            throw new common_1.NotFoundException(`User with id ${userId} not found`);
        }
        const updatedUser = await collection.findOne({ _id: objectId });
        if (!updatedUser) {
            console.warn(`Task was added, but user with id ${userId} could not be retrieved`);
            return { message: "Task added successfully, but the user could not be returned", };
        }
        return { message: "Task added successfully", user: updatedUser, };
    }
    async completeTask(userId, taskId) {
        const collection = await this.getCollection();
        const result = await collection.findOneAndUpdate({
            _id: new mongodb_1.ObjectId(userId),
            "user.tasks.id": taskId
        }, {
            $set: { "user.tasks.$.task.completed": true }
        });
        return "Task marked as completed successfully";
    }
    async addReminder(userId, reminder) {
        const collection = await this.getCollection();
        const objectId = new mongodb_1.ObjectId(userId);
        const userDoc = await collection.findOne({ _id: objectId });
        if (!userDoc) {
            throw new common_1.NotFoundException(`User with id ${userId} not found`);
        }
        const reminderId = "r" + ((userDoc.user?.reminders?.length ?? 0) + 1);
        const result = await collection.updateOne({ _id: objectId }, { $push: { "user.reminders": { reminder: { ...reminder, completed: false }, id: reminderId } } });
        if (result.matchedCount === 0) {
            throw new common_1.NotFoundException(`User with id ${userId} not found`);
        }
        const updatedUser = await collection.findOne({ _id: objectId });
        if (!updatedUser) {
            console.warn(`Reminder was added, but user with id ${userId} could not be retrieved`);
            return { message: "Reminder added successfully, but the user could not be returned", };
        }
        return { message: "Reminder added successfully", user: updatedUser, };
    }
    async completeReminder(userId, reminderId) {
        const collection = await this.getCollection();
        const result = await collection.findOneAndUpdate({
            _id: new mongodb_1.ObjectId(userId),
            "user.reminders.id": reminderId
        }, {
            $set: { "user.reminders.$.reminder.completed": true }
        });
        return "Reminder marked as completed successfully";
    }
    async findByEmailOrUsername(email, username) {
        const collection = await this.getCollection();
        const existingData = await collection.findOne({
            $or: [{ 'user.email': email }, { 'user.username': username }]
        });
        if (!existingData)
            return null;
        const result = {};
        if (existingData.user.email === email)
            result.email = true;
        if (existingData.user.username === username)
            result.username = true;
        return result;
    }
    async sendPasswordRecoveryEmail(email) {
        const collection = await this.getCollection();
        const user = await collection.findOne({ "user.email": email });
        if (!user) {
            throw new common_1.NotFoundException(`There is no user with the email ${email}`);
        }
        const nombre = user.user?.name ?? 'User';
        const username = user.user?.username ?? '(no username)';
        const password = user.user?.password ?? '(no password)';
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT ?? "587"),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        const info = await transporter.sendMail({
            from: `"Soporte Agenda" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Recuperación de contraseña",
            html: `
        <h2>Hola ${nombre},</h2>
        <p>Hemos recibido una solicitud de recuperación de contraseña para tu cuenta.</p>
        <p><strong>Usuario:</strong> ${username}</p>
        <p><strong>Contraseña actual:</strong> ${password}</p>
        <br />
        <p>Si no solicitaste esta información, puedes ignorar este mensaje.</p>
        <p style="color: gray; font-size: 12px;">Este es un correo generado automáticamente, no respondas a este mensaje.</p>
      `,
        });
        console.log(`Email with password sent to ${email}:`, info.messageId);
        return { message: "Recovery email sent with current password" };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map