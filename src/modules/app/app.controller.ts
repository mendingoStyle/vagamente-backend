import {
  Controller,
  Get,
} from '@nestjs/common'

import { version } from '../../../package.json'

class ResponseRoot {
  version: string
}
class ResponseHealth extends ResponseRoot {
  status: string
}
@Controller()
export class AppController {
  constructor() { }

  @Get()
  index(): ResponseRoot {
    return {
      version,
    }
  }

  @Get('/health')
  healthCheck(): ResponseHealth {
    return {
      status: 'UP',
      version,
    }
  }

}
