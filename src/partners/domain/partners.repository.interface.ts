import { PartnersEntity } from './partners.entity';

export interface IPartnersRepository {
  findAll(dto: { page: number; limit: number }): Promise<{
    datas: PartnersEntity[];
    count: number;
  }>;
  findById(id: string): Promise<PartnersEntity | null>;
  findByBusinessNumber(businessNumber: string): Promise<PartnersEntity | null>;
  create(partners: PartnersEntity): Promise<PartnersEntity>;
  update(partners: PartnersEntity): Promise<PartnersEntity>;
}
