import { Injectable, NotFoundException } from '@nestjs/common';
import { connectDB } from '../../../database/connectDB';
import { ObjectId } from 'mongodb';
import * as dotenv from "dotenv";
import * as nodemailer from "nodemailer";

dotenv.config();
const dbCollection = 'user'; // usa plural si así se llama en tu DB

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
    const doc = await collection.findOne({ _id: new ObjectId(id) });
    if (!doc) throw new NotFoundException(`User with id ${id} not found`);
    return doc;
  }

  async create(user: any) {
    const collection = await this.getCollection();
    const newUser = { user }; // siempre guardamos dentro de "user"
    const result = await collection.insertOne(newUser);
    return { _id: result.insertedId, ...newUser };
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
    const result = await collection.replaceOne(
      { _id: new ObjectId(id) },
      { user: body } // respetar estructura
    );
    if (result.matchedCount === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { message: 'User updated completely', user: { _id: id, ...body } };
  }

  async patch(id: string, body: any) {
    const collection = await this.getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { user: body } }
    );
    if (result.matchedCount === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { message: 'User updated partially' };
  }

  async addTask(userId: string, tarea: any) {
    const collection = await this.getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { "user.tareas": tarea } }
    );

    if (result.matchedCount === 0) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const updatedUser = await collection.findOne({ _id: new ObjectId(userId) });

    if (!updatedUser) {
      console.warn(`La tarea se agregó, pero no se pudo recuperar el usuario con id ${userId}`);
      return { message: "Tarea agregada correctamente, pero no se pudo devolver el usuario" };
    }

    return { message: "Tarea agregada correctamente", user: updatedUser };
  }

  async sendPasswordRecoveryEmail(correo: string) {
    const collection = await this.getCollection();
    const userDoc = await collection.findOne({ "user.correo": correo });

    if (!userDoc) {
      throw new NotFoundException(`No existe un usuario con el correo ${correo}`);
    }

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${userDoc._id}`;

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
      to: correo,
      subject: "Recuperación de contraseña",
      html: `
        <h1>Recuperación de contraseña</h1>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    console.log(`📧 Correo enviado correctamente a ${correo}: ${info.messageId}`);

    return { message: "Correo de recuperación enviado", link: resetLink };
  }
}
