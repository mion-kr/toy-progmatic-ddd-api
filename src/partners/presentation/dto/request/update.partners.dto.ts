import { PartialType } from '@nestjs/swagger';
import { CreatePartnersDto } from './create.partners.dto';

export class UpdatePartnersDto extends PartialType(CreatePartnersDto) {}
