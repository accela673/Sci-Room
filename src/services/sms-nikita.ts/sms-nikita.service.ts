import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SmsNikitaService {
  async sendSms(phoneNumber: string, code: string) {
    try {
      const body = `<?xml version="1.0" encoding="UTF-8"?>
                   <message>
                    <login>Garnizon1</login>
                    <pwd>uo_bWwZD</pwd>
                    <id>${Math.random().toString().substr(2, 6)}</id>
                    <sender>G-SOS KG</sender>
                    <text>Код для подтверждения ${code}</text>
                    <time></time>
                    <phones>
                      <phone>${phoneNumber}</phone>
                    </phones>
                  </message>`;
      const response = await axios.post(
        'https://smspro.nikita.kg/api/message',
        body,
        {
          headers: {
            'Content-Type': 'text/xml',
          },
        },
      );
      return response;
    } catch (e) {
      console.log(e.message);
    }
  }
}
