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
exports.RemindersService = void 0;
const common_1 = require("@nestjs/common");
const connectDB_1 = require("../../../database/connectDB");
const mongodb_1 = require("mongodb");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const dbCollection = 'user';
let RemindersService = class RemindersService {
    constructor() {
        this.collectionName = dbCollection;
    }
    async getCollection() {
        const db = await (0, connectDB_1.connectDB)();
        return db.collection(this.collectionName);
    }
    async addReminder(userId, reminder) {
        const collection = await this.getCollection();
        const objectId = new mongodb_1.ObjectId(userId);
        const userDoc = await collection.findOne({ _id: objectId });
        if (!userDoc) {
            throw new common_1.NotFoundException(`User with id ${userId} not found`);
        }
        const reminderId = "t" + ((userDoc.user?.reminders?.length ?? 0) + 1);
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
};
exports.RemindersService = RemindersService;
exports.RemindersService = RemindersService = __decorate([
    (0, common_1.Injectable)()
], RemindersService);
//# sourceMappingURL=reminders.service.js.map