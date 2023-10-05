import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CodeEntity } from './entities/code.entity';
import { EmailModule } from '../mailer/email.module';
import { EmailService } from '../mailer/email.service';

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([UserEntity, CodeEntity])],
  providers: [UserService, EmailService],
  exports: [UserService],
})
export class UserModule {}
