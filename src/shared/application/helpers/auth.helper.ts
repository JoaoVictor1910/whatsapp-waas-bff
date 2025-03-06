import { ROLE_ENUM } from '@/shared/domain/enums';
import { IHubs } from '@/shared/domain/interfaces';
import { TokenType } from '@/shared/domain/types';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import * as jwt from 'jsonwebtoken';

export class AuthHelper {
  decodeJwt(bearerToken: string): TokenType {
    if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token JWT não fornecido');
    }

    const token = bearerToken.split(' ')[1];

    try {
      const decodedToken: TokenType = jwt.decode(token);
      if (!decodedToken) {
        throw new UnauthorizedException('Token JWT inválido');
      }
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException('Token JWT inválido');
    }
  }

  mapHubs(profiles: string[]): IHubs[] {
    const hubsMap = new Map<string, IHubs>();

    for (const profile of profiles) {
      const { area, name, role } = this.matchHub(profile);
      if (!area || !name || !role) continue;

      const key = `${area}_${name}`;

      if (!hubsMap.has(key)) {
        hubsMap.set(key, {
          area,
          name,
          roles: [],
          phoneNumbers: [],
        });
      }

      const hub = hubsMap.get(key)!;
      if (hub && !hub.roles.includes(role as ROLE_ENUM)) {
        hub.roles.push(role as ROLE_ENUM);
      }
    }

    return Array.from(hubsMap.values());
  }

  validateHub(selectedHubs: string[], hubs: IHubs[]): boolean {
    return [...selectedHubs].every((it) => hubs.some((hub) => hub.name === it));
  }

  parseHubs(hubs: string): string[] {
    return hubs?.split(',')?.map((hub) => hub.trim()) ?? [];
  }

  private matchHub(profile: string) {
    const regex = /^(?:([A-Z0-9-_]+)_([A-Z]+)_([A-Za-z0-9-_]+)(?:_([A-Z]+))?)$/;
    const match = profile.match(regex);
    if (!match) return {};

    const [, , area, name, role] = match;
    return {
      area,
      name,
      role,
    };
  }
}
