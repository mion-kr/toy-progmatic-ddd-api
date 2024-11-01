import { Module } from '@nestjs/common';
import { CommonPartnersService } from './application/common.partners.service';
import { PartnersService } from './application/partners.service';
import { PartnersRepository } from './infrastructure/partners.repository';
import { PartnersController } from './presentation/partners.controller';

@Module({
  imports: [],
  controllers: [PartnersController],
  providers: [PartnersService, CommonPartnersService, PartnersRepository],
  exports: [PartnersService, CommonPartnersService],
})
export class PartnersModule {}
