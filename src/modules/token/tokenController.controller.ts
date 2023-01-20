import { Controller} from '@nestjs/common'
import { TokenService } from './tokenController.service'

@Controller()
export class TokenController {
  constructor(private readonly service: TokenService) {}


}
