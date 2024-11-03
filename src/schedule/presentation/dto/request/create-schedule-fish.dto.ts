import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateScheduleFishDto {
  @ApiProperty({
    description: '어종 ID',
    example: 'fish-1',
  })
  @IsString()
  fishId: string;
}
