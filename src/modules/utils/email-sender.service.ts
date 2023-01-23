import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmailSenderDto } from "./dto/emailSender.dto";
import { UtilsService } from "./utils.service";
import { createTransport } from 'nodemailer'
import Mustache from 'mustache'
import fs from 'fs'
import path from 'path'

@Injectable()
export class EmailSenderSevice {
  constructor(
    private config: ConfigService,
    private utils: UtilsService
  ) { }
  async sender(
    senderDto: EmailSenderDto,
  ): Promise<{}> {
    const url = senderDto.url
    const transporter = createTransport({
      host: this.config.get('HOST_EMAIL'),
      port: parseInt(this.config.get('PORT_EMAIL')),
      secure: false,
      auth: {
        user: this.config.get('EMAIL'),
        pass: this.config.get('PASSWORD_EMAIL')
      },
    });

    const filePath = path.resolve(__dirname, 'templates', 'forget-password.html')
    console.log(filePath)
    const templateFile = fs.readFileSync(filePath, 'utf8');
    const rendered = Mustache.render(templateFile, { url });

    const mailOptions = {
      from: this.config.get('EMAIL'),
      to: senderDto.email,
      subject: senderDto.subject,
      html: rendered
    };

    const promise = new Promise(async (resolve, reject) => {
      return transporter.sendMail(mailOptions,
        async function (error, info) {
          if (error) {
            resolve(null);
          } else {
            resolve({ message: senderDto.messageAccept })
          }
        }
      );
    })
    if (await promise == null) this.utils.throwErrorBadReqException('Erro ao enviar o email');
    return promise
  }
}