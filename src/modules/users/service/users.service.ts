import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { connectDB } from '../../../database/connectDB';
import { ObjectId } from 'mongodb';
import * as dotenv from "dotenv";
import { CreateUserDto } from '../dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

dotenv.config();                      // Load environment variables
const dbCollection = 'user';          // MongoDB collection name

@Injectable()
export class UsersService {
  constructor(private readonly jwtService: JwtService) {}

  private readonly collectionName = dbCollection;

  public async getCollection() {
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
    const decodedUsername = existingData.user.username;
    if (decodedUsername === username ) result.username = true;

    return result;
  }

  
}