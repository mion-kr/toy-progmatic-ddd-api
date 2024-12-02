import { CancelReservationCommandHandler } from './cancel-reservation.command-handler';
import { CreateReservationCommandHandler } from './create-reservation.command-handler';
import { PaymentReservationCommandHandler } from './payment-reservation.command-handler';

export const commandHandlers = [
  CreateReservationCommandHandler,
  PaymentReservationCommandHandler,
  CancelReservationCommandHandler,
];
