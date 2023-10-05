import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(email: string, username: string, code: string) {
    await this.mailerService.sendMail({
      to: `${email}`,
      subject: 'Account Confirmation',
      template: './confirmation',
      html: `<p>Hello ${username}!</p>
             <p>Your confirmation code: ${code}</p>
             <p>Do not give it to anyone. This code expires in 15 minutes.</p>`,
    });
  }
}
