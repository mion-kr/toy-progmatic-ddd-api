import { CanceledEventHandler } from './canceled.event-handler';
import { PaymentCompletedEventHandler } from './payment-completed.event-handler';

export const eventHandlers = [
  PaymentCompletedEventHandler,
  CanceledEventHandler,
];

