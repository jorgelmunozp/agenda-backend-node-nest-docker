import { Injectable, NotFoundException } from '@nestjs/common';
import { connectDB } from '../../../database/connectDB';
import { ObjectId, Document } from 'mongodb';
import * as dotenv from "dotenv";

dotenv.config();
const dbCollection = 'user';

@Injectable()
export class UsersService {
  private readonly collectionName = dbCollection;

  private async getCollection() {
    const db = await connectDB();
    return db.collection(this.collectionName);
  }

  async getAll() {
    const collection = await this.getCollection();
    return collection.find().toArray();
  }

  async getById(id: string) {
    const collection = await this.getCollection();
    const user = await collection.findOne({ _id: new ObjectId(id) });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async create(user: any) {
    const collection = await this.getCollection();
    const result = await collection.insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  async delete(id: string) {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { message: 'User deleted successfully' };
  }

  async update(id: string, body: any) {
    const collection = await this.getCollection();
    const result = await collection.replaceOne({ _id: new ObjectId(id) }, body);
    if (result.matchedCount === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { message: 'User updated completely', user: { _id: id, ...body } };
  }

  async patch(id: string, body: any) {
    const collection = await this.getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );
    if (result.matchedCount === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { message: 'User updated partially' };
  }

  /**
   * Añadir una nueva tarea al usuario
   */
  async addTask(userId: string, tarea: any) {
    const collection = await this.getCollection();

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $push: { 'user.tareas': tarea } }, // <-- aseguramos que el array correcto es 'tareas'
      { returnDocument: 'after' }
    );

    if (!result || !result.value) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return result.value; // Devuelve el usuario actualizado
  }

}
