import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '@/schemas/user.schema';
import { AppConfig } from '@/config/app.config';

@Injectable()
export class UserSeeder implements Seeder {
  private readonly logger = new Logger(UserSeeder.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
    drop(): Promise<any> {
        throw new Error('Method not implemented.');
    }

  async seed(): Promise<any> {
    this.logger.log('Đang khởi tạo tài khoản Admin mặc định...');

    const salt = await bcrypt.genSalt(AppConfig.SECURITY.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash('123123', salt); 

    const adminUser = {
      email: 'admin@gmail.com',
      password: hashedPassword,
      fullName: 'Quản trị viên Hệ thống',
      role: 'ADMIN', 
      isActive: true,
    };

    const existingAdmin = await this.userModel.findOne({ email: adminUser.email });

    if (!existingAdmin) {
      this.logger.log(' Tạo mới tài khoản Admin thành công!');
      return this.userModel.create(adminUser);
    } else {
      this.logger.log(' Tài khoản Admin đã tồn tại trên Atlas, không cần tạo lại.');
      return null;
    }
  }


}