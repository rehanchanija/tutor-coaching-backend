import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userData: any): Promise<UserDocument> {
    console.log('[UsersService] Creating user with data:', userData);
    const { email, phone, password } = userData;
    
    // Check Email unique if provided
    if (email) {
      const existingEmail = await this.userModel.findOne({ email });
      if (existingEmail) throw new ConflictException('Email already exists');
    }

    // Check Phone unique
    const existingPhone = await this.userModel.findOne({ phone });
    if (existingPhone) {
      console.log('[UsersService] Conflict: Phone already exists:', phone);
      throw new ConflictException('Phone number already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      ...userData,
      password: hashedPassword,
    });
    const result = await user.save();
    console.log('[UsersService] User created successfully:', result._id);
    return result;
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().populate('batchId').exec();
  }

  async findAllByBatch(batchId: string): Promise<UserDocument[]> {
    return this.userModel.find({ batchId: batchId as any }).populate('batchId').exec();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).populate('batchId').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmailOrPhone(identifier: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        $or: [{ email: identifier }, { phone: identifier }],
      })
      .exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateData: any): Promise<UserDocument> {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const user = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
