import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CodeEntity } from './entities/code.entity';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';
import { UserController } from './user.controller';

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([UserEntity, CodeEntity])],
  providers: [UserService, EmailService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
