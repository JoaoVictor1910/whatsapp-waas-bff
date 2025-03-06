import { ROLE_ENUM } from '@/shared/domain/enums';
import { IHubs } from './hubs.interface';

export interface IUser {
  racf: string;
  email: string;
  employeeId: string;
  role: ROLE_ENUM;
  hubs: IHubs[];
}
