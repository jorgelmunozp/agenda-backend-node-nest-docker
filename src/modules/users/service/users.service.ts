import { Injectable, NotFoundException } from '@nestjs/common';
import { connectDB } from '../../../database/connectDB';
import { ObjectId } from 'mongodb';
import * as dotenv from "dotenv";
import * as nodemailer from "nodemailer";
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateTaskDto } from '../dto/create-task.dto';
import { CreateReminderDto } from '../dto/create-reminder.dto';

dotenv.config();                      // Load environment variables
const dbCollection = 'user';          // MongoDB collection name

@Injectable()
export class UsersService {
  private readonly collectionName = dbCollection;

  private async getCollection() {
    const db = await connectDB();     // Database connection
    return db.collection(this.collectionName);  // Return the specific collection
  }

//************************** USERS *************************************/
  /*** SERVICE: GET ALL USERS ************/
  async getAll() {                    // Get all users from the collection
    const collection = await this.getCollection();
    return collection.find().toArray();
  }

  /*** SERVICE: GET USER BY ID ************/
  async getById(id: string) {
    const collection = await this.getCollection();
    const doc = await collection.findOne({ _id: new ObjectId(id) });
    if (!doc) throw new NotFoundException(`User with id ${id} not found`);
    return doc;
  }

  /*** SERVICE: CREATE NEW USER ************/
  async create(createUserDto: CreateUserDto) {
    const collection = await this.getCollection();
    const newUser = { user: createUserDto };
    const result = await collection.insertOne(newUser);
    return { message: 'User created successfully', _id: result.insertedId, ...newUser };
  }

  /*** SERVICE: DELETE USER ************/
  async delete(id: string) {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { message: 'User deleted successfully' };
  }

  /*** SERVICE: UPDATE USER (PUT) ************/
  async update(id: string, body: CreateUserDto) {
    const collection = await this.getCollection();
    const result = await collection.replaceOne(
      { _id: new ObjectId(id) },
      { user: body }
    );
    if (result.matchedCount === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { message: 'User updated completely', user: { _id: id, ...body } };   // Response to the API caller
  }

  /*** SERVICE: PARTIALLY UPDATE USER (PATCH) ************/
  async patch(id: string, body: Partial<CreateUserDto>) {
    const collection = await this.getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { user: body } }
    );
    if (result.matchedCount === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { message: 'User updated partially' };    // Response to the API caller
  }

//************************** TASKS *************************************/
  /*** SERVICE: ADD A TASK TO AN USER ************/
  async addTask(userId: string, task: CreateTaskDto) {
    const collection = await this.getCollection();
    const objectId = new ObjectId(userId);

    // Task Id
    const userDoc = await collection.findOne({ _id: objectId });    // Obtener el usuario
    if (!userDoc) { throw new NotFoundException(`User with id ${userId} not found`); }
    const taskId = "t" + ((userDoc.user?.tasks?.length ?? 0) + 1);   // Calcular taskId como la longitud actual del arreglo + 1

    const result = await collection.updateOne(
      { _id: objectId },
      { $push: { "user.tasks": { task: { ...task, completed: false }, id: taskId } } } as any // se fuerza el tipo any porque TS valida paths anidados
    );

    if (result.matchedCount === 0) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const updatedUser = await collection.findOne({ _id: objectId });

    if (!updatedUser) {
      console.warn(`Task was added, but user with id ${userId} could not be retrieved`);
      return { message: "Task added successfully, but the user could not be returned", };
    }

    return { message: "Task added successfully", user: updatedUser, };    // Response to the API caller
  }

  /*** SERVICE: CHECK A COMPLETED TASK ************/
  async completeTask(userId: string, taskId: string) {
    const collection = await this.getCollection();

    const result = await collection.findOneAndUpdate(
      {
        _id: new ObjectId(userId),
        "user.tasks.id": taskId // busco la tarea específica
      },
      {
        $set: { "user.tasks.$.task.completed": true } // actualizo el estado a completed
      }
    );
    
    return "Task marked as completed successfully";
  }

//************************** REMINDERS *************************************/
  /*** SERVICE: ADD A REMINDER TO AN USER ************/
  async addReminder(userId: string, reminder: CreateReminderDto) {
    const collection = await this.getCollection();
    const objectId = new ObjectId(userId);

    // Reminder Id
    const userDoc = await collection.findOne({ _id: objectId });    // Obtener el usuario
    if (!userDoc) { throw new NotFoundException(`User with id ${userId} not found`); }
    const reminderId = "r" + ((userDoc.user?.reminders?.length ?? 0) + 1);   // Calcular taskId como la longitud actual del arreglo + 1

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

  /*** SERVICE: CHECK A COMPLETED REMINDER ************/
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
  
//************************** REGISTER *************************************/
  /*** SERVICE: CHECK IF USERNAME OR EMAIL USER ALREADY EXISTS ************/
  async findByEmailOrUsername(email: string, username: string) {
    const collection = await this.getCollection();

    // Buscar usuario que tenga el email o el username
    const existingData = await collection.findOne({
      $or: [ { 'user.email': email }, { 'user.username': username } ]
    });

    // Si no existe, retornamos null
    if (!existingData) return null;

    // Retornamos específicamente cuál campo está repetido
    const result: { email?: boolean; username?: boolean } = {};
    if (existingData.user.email === email) result.email = true;
    if (existingData.user.username === username) result.username = true;

    return result;
  }

//************************** PASSWORD RECOVERY *************************************/
  /*** SERVICE: SEND PASSWORD RECOVERY EMAIL ************/
  async sendPasswordRecoveryEmail(email: string) {
    const collection = await this.getCollection();
    const user = await collection.findOne({ "user.email": email });

    if (!user) {
      throw new NotFoundException(`There is no user with the email ${email}`);
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

    console.log(`Email with password sent to ${email}:`, info.messageId);  // Message on the server console

    return { message: "Recovery email sent with current password" };  // Response to the API caller
  }

}