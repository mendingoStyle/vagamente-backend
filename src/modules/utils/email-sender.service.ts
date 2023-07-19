import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmailSenderDto } from "./dto/emailSender.dto";
import { UtilsService } from "./utils.service";
import { createTransport } from 'nodemailer'
import Mustache from 'mustache'
import fs from 'fs'
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
    console.log(this.config.get('HOST_EMAIL'),
      parseInt(this.config.get('PORT_EMAIL')),
      this.config.get('EMAIL'),
      this.config.get('PASSWORD_EMAIL'))
    const transporter = createTransport({
      host: this.config.get('HOST_EMAIL'),
      port: parseInt(this.config.get('PORT_EMAIL')),
      secure: true,
      auth: {
        user: this.config.get('EMAIL'),
        pass: this.config.get('PASSWORD_EMAIL')
      },
    });

    const templateFile = this.config.get('APP_ENV') === 'DEVELOPMENT'
      ? fs.readFileSync('src\\modules\\utils\\templates\\forget-password.html', 'utf8')
      : fs.readFileSync('src/modules/utils/templates/forget-password.html', 'utf8');

    const rendered = Mustache.render(templateFile, { url: url, vagamenteUrl: this.config.get('FRONT_URL') });

    const mailOptions = {
      from: this.config.get('EMAIL'),
      to: senderDto.email,
      subject: senderDto.subject,
      html: rendered,
    };

    const promise = new Promise(async (resolve, reject) => {
      return transporter.sendMail(mailOptions,
        async function (error, info) {
          if (error) {
            console.log(error)
            resolve(null);
          } else {
            resolve({ message: senderDto.messageAccept })
          }
        }
      );
    })
    if (await promise == null) throw this.utils.throwErrorBadReqException('Erro ao enviar o email');
    return promise
  }
}