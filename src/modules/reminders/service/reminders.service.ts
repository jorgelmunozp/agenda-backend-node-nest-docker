import { Injectable, NotFoundException } from '@nestjs/common';
import { connectDB } from '../../../database/connectDB';
import { ObjectId } from 'mongodb';
import * as dotenv from "dotenv";
import { CreateReminderDto } from '../dto/create-reminder.dto';

dotenv.config();                      // Load environment variables
const dbCollection = 'user';          // MongoDB collection name

@Injectable()
export class RemindersService {
  private readonly collectionName = dbCollection;

  private async getCollection() {
    const db = await connectDB();     // Database connection
    return db.collection(this.collectionName);  // Return the specific collection
  }

//************************** TASKS *************************************/
  /*** SERVICE: ADD A TASK TO AN USER ************/
  async addReminder(userId: string, reminder: CreateReminderDto) {
    const collection = await this.getCollection();
    const objectId = new ObjectId(userId);

    // Reminder Id
    const userDoc = await collection.findOne({ _id: objectId });    // Obtener el usuario
    if (!userDoc) { throw new NotFoundException(`User with id ${userId} not found`); }
    const reminderId = "t" + ((userDoc.user?.reminders?.length ?? 0) + 1);   // Calcular reminderId como la longitud actual del arreglo + 1

    const result = await collection.updateOne(
      { _id: objectId },
      { $push: { "user.reminders": { reminder: { ...reminder, completed: false }, id: reminderId } } } as any // se fuerza el tipo any porque TS valida paths anidados
    );

    if (result.matchedCount === 0) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const updatedUser = await collection.findOne({ _id: objectId });

    if (!updatedUser) {
      console.warn(`Reminder was added, but user with id ${userId} could not be retrieved`);
      return { message: "Reminder added successfully, but the user could not be returned", };
    }

    return { message: "Reminder added successfully", user: updatedUser, };    // Response to the API caller
  }

  /*** SERVICE: CHECK A COMPLETED TASK ************/
  async completeReminder(userId: string, reminderId: string) {
    const collection = await this.getCollection();

    const result = await collection.findOneAndUpdate(
      {
        _id: new ObjectId(userId),
        "user.reminders.id": reminderId // busco la tarea específica
      },
      {
        $set: { "user.reminders.$.reminder.completed": true } // actualizo el estado a completed
      }
    );
    
    return "Reminder marked as completed successfully";
  }

}