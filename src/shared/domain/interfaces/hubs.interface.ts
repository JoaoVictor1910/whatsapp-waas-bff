import { ROLE_ENUM } from '@/shared/domain/enums';
import { IPhoneNumbers } from './phone-numbers.interface';

export interface IHubs {
  name: string;
  area: string;
  roles: ROLE_ENUM[];
  phoneNumbers: IPhoneNumbers[];
}
