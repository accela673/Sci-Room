import { Module } from '@nestjs/common';
import { SmsNikitaService } from './sms-nikita.service';

@Module({
  providers: [SmsNikitaService],
  exports: [SmsNikitaService],
})
export class SmsNikitaModule {}
