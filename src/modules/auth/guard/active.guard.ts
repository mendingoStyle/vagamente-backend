import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { UsersService } from '../../users/users.service'

@Injectable()
export class ActiveGuard implements CanActivate {
  constructor(
    private usersService: UsersService
  ) { }
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest()
    return this.usersService
      .findAll({ _id: req.user.sub })
      .then((user) => {
        req.user = user[0]
        return true
      })
  }
}
