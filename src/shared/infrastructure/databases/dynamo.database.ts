import { Injectable } from '@nestjs/common';
import {
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { DdbDocClient } from '@/shared/main/configs';

@Injectable()
export abstract class DynamoDatabase<T> {
  protected readonly client: DynamoDBDocumentClient;
  protected abstract tableName: string;

  constructor(protected readonly ddbDocClient: DdbDocClient) {
    this.client = this.ddbDocClient.getClient();
  }

  async getAll(): Promise<T[]> {
    const command = new ScanCommand({ TableName: this.tableName });
    const response = await this.client.send(command);
    return response.Items as T[];
  }

  async getById(id: string): Promise<T | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id },
    });

    const response = await this.client.send(command);
    return (response.Item as T) || null;
  }
}
