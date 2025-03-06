import { Injectable } from '@nestjs/common';
import { PhoneNumbersRepository } from '../repositories/phone-numbers.repository';
import { User } from '@/shared/domain/entities';
import { IPhoneNumbers } from '@/shared/domain/interfaces';

@Injectable()
export class InfoService {
  constructor(private readonly phoneNumbersR: PhoneNumbersRepository) {}

  async execute(params: InfoService.Params): Promise<InfoService.Result> {
    const phones = this.phoneNumbersR.getAll();

    return;
  }
}

export namespace InfoService {
  export type Params = {
    user: User;
  };
  export type Result = {
    user: User;
    phoneNumbers: IPhoneNumbers;
  };
}
