import { SetMetadata } from '@nestjs/common';

export const publicKey = 'isPublic';
export const Public = () => SetMetadata(publicKey, true);
