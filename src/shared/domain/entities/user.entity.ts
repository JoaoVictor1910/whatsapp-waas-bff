import { IHubs, IUser } from '@/shared/domain/interfaces';
import { ROLE_ENUM } from '@/shared/domain/enums';

export class User {
  private props: IUser;

  constructor(user: IUser) {
    this.props = user;
  }

  get racf(): string {
    return this.props.racf;
  }
  get email(): string {
    return this.props.email;
  }
  get employeeId(): string {
    return this.props.employeeId;
  }
  get role(): ROLE_ENUM {
    return this.props.role;
  }
  get hubs(): IHubs[] {
    return this.props.hubs;
  }

  static create(payload: IUser): User {
    return new User(payload);
  }

  static identifyRole(selectedHubs: string[] | null, hubs: IHubs[]): ROLE_ENUM {
    const selectedSet = new Set(selectedHubs);

    for (const hub of hubs) {
      if (!selectedHubs?.length) {
        if (hub.roles.includes(ROLE_ENUM.APPROVER)) {
          return ROLE_ENUM.APPROVER;
        }

        return ROLE_ENUM.OPERATOR;
      }
      if (selectedSet.has(hub.name) && hub.roles.includes(ROLE_ENUM.APPROVER)) {
        return ROLE_ENUM.APPROVER;
      }
    }

    return ROLE_ENUM.OPERATOR;
  }
}
