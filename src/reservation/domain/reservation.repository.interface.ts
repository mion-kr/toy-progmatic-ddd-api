import { ReservationEntity } from './reservation.entity';

export interface IReservationRepository {
  findAll(dto: {
    page: number;
    limit: number;
  }): Promise<{ datas: ReservationEntity[]; count: number }>;

  findById(id: string): Promise<ReservationEntity | null>;

  create(reservation: ReservationEntity): Promise<ReservationEntity>;

  update(reservation: ReservationEntity): Promise<ReservationEntity>;
}
