import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfirmEmailDto } from '../user/dto/cofirm-email.dto';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendPasswordChangeCode(data: ConfirmEmailDto) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: "Scientist's room password confirmation",
      text: `This is your code for changing password  ${data.code}   Dont give it to anyone!!!`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
      return { message: 'Email sent successfully', info };
    } catch (error) {
      console.error(error);
      throw new Error('Email sending failed');
    }
  }

  async sendEmail(data: ConfirmEmailDto) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: "Scientist's room password confirmation",
      text: `This is your confirmation code  ${data.code}   Dont give it to anyone!!! This code will expire in 15 minutes`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
      return { message: 'Email sent successfully', info };
    } catch (error) {
      console.error(error);
      throw new Error('Email sending failed');
    }
  }
}
