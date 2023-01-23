import { Global, Module } from '@nestjs/common'
import { UtilsService } from './utils.service'
import { EmailSenderSevice } from './email-sender.service'

@Global()
@Module({
  providers: [UtilsService, EmailSenderSevice],
  exports: [UtilsService, EmailSenderSevice],
})
export class UtilsModule { }
