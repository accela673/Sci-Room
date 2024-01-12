import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfirmEmailDto } from '../user/dto/cofirm-email.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendMail(mailOptions): Promise<{ message: string; info: any }> {
    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log('Email sent: ' + info.response);
      return { message: 'Email sent successfully', info };
    } catch (error) {
      this.logger.error('Email sending failed', error);
      throw new Error('Email sending failed');
    }
  }

  async sendPasswordChangeCode(data: ConfirmEmailDto) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: "Scientist's Room Password Confirmation",
      text: `Your code for changing the password is: ${data.code}. Do not share it with anyone!`,
    };

    return this.sendMail(mailOptions);
  }

  async sendEmail(data: ConfirmEmailDto) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: "Scientist's Room Password Confirmation",
      text: `Your confirmation code is: ${data.code}. Do not share it with anyone! This code will expire in 15 minutes`,
    };

    return this.sendMail(mailOptions);
  }
}
