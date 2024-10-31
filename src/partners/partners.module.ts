import { Module } from '@nestjs/common';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { CommonPartnersService } from './application/common.partners.service';
import { PartnersService } from './application/partners.service';
import { PartnersRepository } from './infrastructure/partners.repository';
import { PartnersController } from './presentation/partners.controller';

@Module({
  imports: [PrismaModule],
  controllers: [PartnersController],
  providers: [PartnersService, CommonPartnersService, PartnersRepository],
  exports: [PartnersService],
})
export class PartnersModule {}
