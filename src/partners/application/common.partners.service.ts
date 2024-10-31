import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PartnersEntity } from '../domain/partners.entity';

@Injectable()
export class CommonPartnersService {
  async validateNotFoundPartners(partners: PartnersEntity) {
    if (!partners) {
      throw new NotFoundException('파트너스를 찾을 수 없습니다.');
    }
  }

  async validateConflictBusinessNumber(
    partners: PartnersEntity,
    ignoreBusinessNumber?: string,
  ) {
    if (
      partners &&
      (!ignoreBusinessNumber ||
        partners.businessNumber !== ignoreBusinessNumber)
    ) {
      throw new ConflictException('이미 존재하는 사업자등록번호입니다.');
    }
  }
}
