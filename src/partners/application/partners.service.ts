import { Injectable } from '@nestjs/common';
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
  ) {}

  /**
   * 파트너스 생성
   */
  async create(dto: CreatePartnersDto) {
    const saved_partners = await this.partnersRepository.findByBusinessNumber(
      dto.businessNumber,
    );

    await this.commonPartnersService.validateConflictBusinessNumber(
      saved_partners,
    );

    const partners = PartnersEntity.create({
      ...dto,
      createdBy: dto.businessNumber,
    });

    const createdPartners = await this.partnersRepository.create(partners);

    return createdPartners;
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
  async findById(id: string) {
    const partners = await this.partnersRepository.findById(id);

    await this.commonPartnersService.validateNotFoundPartners(partners);

    return partners;
  }

  /**
   * 파트너스 수정
   */
  async update(id: string, dto: UpdatePartnersDto, userId: string) {
    const partners = await this.partnersRepository.findById(id);

    await this.commonPartnersService.validateNotFoundPartners(partners);
    if (dto.businessNumber) {
      await this.commonPartnersService.validateConflictBusinessNumber(
        partners,
        dto.businessNumber,
      );
    }

    await partners.update({ ...dto, updatedBy: userId });

    const updatedPartners = await this.partnersRepository.update(partners);

    return updatedPartners;
  }

  /**
   * 파트너스 삭제
   */
  async delete(id: string, userId: string) {
    const partners = await this.partnersRepository.findById(id);

    await this.commonPartnersService.validateNotFoundPartners(partners);

    await partners.delete({ deletedBy: userId });

    return await this.partnersRepository.update(partners);
  }
}
