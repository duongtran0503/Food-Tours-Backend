import { seeder } from 'nestjs-seeder';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from '@/schemas/user.schema';
import { UserSeeder } from '@/modules/users/config/user.seeder';

seeder({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
    }),

      MongooseModule
      .forFeature([
        {
          name: User.name,
          schema:UserSchema,
        },
      ])   
  ],
}).run([UserSeeder]); 