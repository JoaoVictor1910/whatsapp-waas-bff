import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

@Injectable()
export class DdbClient {
  private readonly client: DynamoDBClient;

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION', 'us-east-1');

    this.client = new DynamoDBClient({ region });
  }

  getClient(): DynamoDBClient {
    return this.client;
  }
}
