import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { PartnersEntity } from '../domain/partners.entity';
import { PartnersRepository } from '../infrastructure/partners.repository';
import { CreatePartnersDto } from '../presentation/dto/request/create.partners.dto';
import { FindAllPartnersDto } from '../presentation/dto/request/find-all.partners.dto';
import { UpdatePartnersDto } from '../presentation/dto/request/update.partners.dto';
import { CommonPartnersService } from './common.partners.service';

@Injectable()
export class PartnersService {
  constructor(
    private readonly partnersRepository: PartnersRepository,
    private readonly commonPartnersService: CommonPartnersService,

    private readonly prismaService: PrismaService,
  ) {}

  /**
   * 파트너스 생성
   */
  async create(dto: CreatePartnersDto) {
    return await this.prismaService.$transaction(async (tx) => {
      const saved_partners = await this.partnersRepository.findByBusinessNumber(
        dto.businessNumber,
        tx,
      );

      await this.commonPartnersService.validateConflictBusinessNumber(
        saved_partners,
      );

      const partners = PartnersEntity.createNew({
        ...dto,
        createdBy: dto.businessNumber,
      });

      return await this.partnersRepository.create(partners, tx);
    });
  }

  /**
   * 파트너스 목록 조회
   */
  async findAll(dto: FindAllPartnersDto) {
    const { datas, count } = await this.partnersRepository.findAll(dto);

    return { datas, count };
  }
  /**
   * 파트너스 조회
   */
  async findById(id: string, tx?: Prisma.TransactionClient) {
    const partners = await this.partnersRepository.findById(id, tx);

    await this.commonPartnersService.validateNotFoundPartners(partners);

    return partners;
  }

  /**
   * 파트너스 수정
   */
  async update(id: string, dto: UpdatePartnersDto, updatedBy: string) {
    return await this.prismaService.$transaction(async (tx) => {
      const partners = await this.partnersRepository.findById(id, tx);

      await this.commonPartnersService.validateNotFoundPartners(partners);
      if (dto.businessNumber) {
        await this.commonPartnersService.validateConflictBusinessNumber(
          partners,
          dto.businessNumber,
        );
      }

      await partners.update({ ...dto, updatedBy });

      return await this.partnersRepository.update(partners, tx);
    });
  }

  /**
   * 파트너스 삭제
   */
  async delete(id: string, deletedBy: string) {
    return await this.prismaService.$transaction(async (tx) => {
      const partners = await this.partnersRepository.findById(id, tx);

      await this.commonPartnersService.validateNotFoundPartners(partners);

      await partners.delete(deletedBy);

      return await this.partnersRepository.update(partners, tx);
    });
  }
}
