import { HelloController } from '@/hello.world.controller';
import { AuthModule } from '@/modules/auth/auth.module';
import { CategoriesModule } from '@/modules/Categories/category.module';
import { FoodModule } from '@/modules/Foods/food.module';
import { RestaurantModule } from '@/modules/Restaurants/restaurant.module';
import { TourModule } from '@/modules/Tours/tour.module';
import { UploadModule } from '@/modules/upload/upload.module';
import { UsersModule } from '@/modules/users/user.module';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UsersModule,
    UploadModule,
    AuthModule,
    CategoriesModule,
    FoodModule,
    RestaurantModule,
    TourModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('DATABASE_URL');
        if (!uri) {
          throw new Error('DATABASE_URL is not defined in .env');
        }
        return {
          uri: uri,
          connectionFactory(connection) {
            if (connection.readyState === 1) {
              Logger.log('------------------- MongoDB Atlas connected successfully!--------------------', 'Database');
            }
            connection.on('connected', () => {
              Logger.log('------------------- MongoDB Atlas connected successfully!--------------------', 'Database');
            });
            connection.on('error', (error: unknown) => {
              Logger.error(` MongoDB connection error: ${error}`, 'Database');
            });
            return connection;
          }
        };
      },

      inject: [ConfigService],
    })
  ],
  controllers: [HelloController],
  providers: [],
})
export class AppModule { }
