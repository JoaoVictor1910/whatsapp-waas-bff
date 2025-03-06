import { Injectable } from '@nestjs/common';
import { DynamoDatabase } from '@/shared/infrastructure/databases';
import { DdbDocClient } from '@/shared/main/configs';

@Injectable()
export abstract class DynamoRepository<T> extends DynamoDatabase<T> {
  constructor(protected readonly ddbDocClient: DdbDocClient) {
    super(ddbDocClient);
  }
}
