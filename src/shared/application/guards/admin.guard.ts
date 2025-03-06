import { User } from '@/shared/domain/entities';
import { ROLE_ENUM } from '@/shared/domain/enums';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: User = request['x-user'];

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    if (user.role !== ROLE_ENUM.APPROVER) {
      throw new ForbiddenException(
        'Acesso negado: apenas aprovadores podem acessar',
      );
    }

    return true;
  }
}
