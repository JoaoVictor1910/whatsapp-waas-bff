import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RegularGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}
