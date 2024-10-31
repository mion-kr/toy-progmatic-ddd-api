import { PartnersEntity } from '../../../domain/partners.entity';
import { CreatePartnersResponse } from './create.partners.response';

export class FindAllPartnersResponse {
  partners: CreatePartnersResponse[];
  totalCount: number;

  constructor(partners: PartnersEntity[], totalCount: number) {
    this.partners = partners.map(
      (partner) => new CreatePartnersResponse(partner),
    );
    this.totalCount = totalCount;
  }
}
