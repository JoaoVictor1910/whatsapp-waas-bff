import { IPhoneNumbers } from '@/shared/domain/interfaces';
import { DynamoRepository } from '@/shared/infrastructure/repositories';

export class PhoneNumbersRepository extends DynamoRepository<IPhoneNumbers> {
  protected tableName = 'whatsapp_phone_number';
}
