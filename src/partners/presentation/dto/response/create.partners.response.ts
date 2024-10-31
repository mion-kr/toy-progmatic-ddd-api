import { PickType } from '@nestjs/swagger';
import { PartnersEntity } from '../../../domain/partners.entity';
import { CreatePartnersDto } from '../request/create.partners.dto';

export class CreatePartnersResponse extends PickType(CreatePartnersDto, [
  'name',
  'businessNumber',
] as const) {
  id: string;

  constructor(partial: PartnersEntity) {
    super();
    this.id = partial.id;
    this.name = partial.name;
    this.businessNumber = partial.businessNumber;
  }
}
