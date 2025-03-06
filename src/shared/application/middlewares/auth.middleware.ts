import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthHelper } from '@/shared/application/helpers';
import { User } from '@/shared/domain/entities';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private authHelper = new AuthHelper();

  use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;
    const selectedHubs: string[] = this.authHelper.parseHubs(
      req.headers['x-hubs']?.toString(),
    );

    const decodedToken = this.authHelper.decodeJwt(authorization);
    if (!decodedToken) {
      throw new UnauthorizedException('Token JWT inválido');
    }
    const { roles, racf, employeeId, email } = decodedToken;

    const hubs = this.authHelper.mapHubs(roles);

    if (selectedHubs && !this.authHelper.validateHub(selectedHubs, hubs)) {
      throw new ForbiddenException('Acesso negado ao hub selecionado');
    }

    const user = User.create({
      employeeId,
      racf,
      email,
      role: User.identifyRole(selectedHubs, hubs),
      hubs: hubs,
    });

    req['x-user'] = user;

    next();
  }
}
