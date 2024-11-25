import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { ReservationModule } from './reservation/reservation.module';
import { ScheduleModule } from './schedule/schedule.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { UserModule } from './user/user.module';

console.log(process.env.NODE_ENV);
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'local' ? '.env_local' : '.env',
      isGlobal: true,
    }),
    PrismaModule,

    UserModule,

    ProductModule,
    ScheduleModule,
    ReservationModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
