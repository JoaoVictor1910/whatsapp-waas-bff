import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DdbClient } from './ddbClient.config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

@Injectable()
export class DdbDocClient {
  private readonly documentClient: DynamoDBDocumentClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly ddbClient: DdbClient,
  ) {
    const marshallOptions = {
      convertEmptyValues: false,
      removeUndefinedValues: false,
      convertClassInstanceToMap: false,
    };

    const unmarshallOptions = { wrapNumbers: false };
    const translateConfig = { marshallOptions, unmarshallOptions };

    const isLocal = this.configService.get<string>('environment') === 'local';
    const localEndpoint = this.configService.get<string>(
      'dynamo_endpoint',
      'http://host.docker.internal:4566',
    );

    const localClient = new DynamoDBClient({
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
      endpoint: localEndpoint,
    });

    this.documentClient = isLocal
      ? DynamoDBDocumentClient.from(localClient)
      : DynamoDBDocumentClient.from(
          this.ddbClient.getClient(),
          translateConfig,
        );
  }

  getClient(): DynamoDBDocumentClient {
    return this.documentClient;
  }
}
