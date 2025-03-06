import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DdbDocClient, DdbClient } from '@/shared/main/configs';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [DdbClient, DdbDocClient],
  exports: [DdbClient, DdbDocClient],
})
export class DynamoModule {}
