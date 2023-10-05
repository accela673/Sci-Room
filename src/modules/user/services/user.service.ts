import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../entities/user.entity';
import { BaseService } from 'src/base/base.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConfirmEmailDto } from '../dto/cofirm-email.dto';
import { CodeEntity } from '../entities/code.entity';
import { EmailService } from 'src/modules/mailer/email.service';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CodeEntity)
    private readonly codeRepository: Repository<CodeEntity>,
    private readonly emailService: EmailService,
  ) {
    super(userRepository);
  }

  async createConfirmCode() {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    let randomString = '';

    for (let i = 0; i < 3; i++) {
      const randomLetterIndex = Math.floor(Math.random() * letters.length);
      const randomNumberIndex = Math.floor(Math.random() * numbers.length);
      randomString += letters[randomLetterIndex] + numbers[randomNumberIndex];
    }

    // Shuffle the string to randomize the order
    randomString = randomString
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');

    return randomString;
  }

  async saveUser(user: UserEntity) {
    return await this.userRepository.save(user);
  }

  async create(user: CreateUserDto): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newConfirmCode = await this.createConfirmCode();
    const code = await this.codeRepository.create();
    code.confirmCode = newConfirmCode;
    await this.codeRepository.save(code);
    const newUser = this.userRepository.create({
      ...user,
      password: hashedPassword,
      confirmCodeId: code.id,
    });
    // await this.emailService.sendMail(
    //   user.email,
    //   user.firstName,
    //   code.confirmCode,
    // );
    console.log(code.confirmCode);
    return this.userRepository.save(newUser);
  }

  async findOneByEmail(email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { email: email } });
  }

  async findById(id: number): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({
      where: { id: id },
      relations: ['articles'],
    });
  }

  async activateUser(confirmEmailDto: ConfirmEmailDto) {
    const user: UserEntity = await this.findOneByEmail(confirmEmailDto.email);
    if (user) {
      const code = await this.codeRepository.findOne({
        where: { id: user.confirmCodeId },
      });
      const currentTime = new Date();
      const createdAt = code.createdAt;
      const timeDifference = currentTime.getTime() - createdAt.getTime();
      const maxValidityDuration = 15 * 60 * 1000;
      if (timeDifference > maxValidityDuration) {
        throw new BadRequestException('The code has expired');
      }
      if (
        code.confirmCode === confirmEmailDto.code &&
        !user.isConfirmed &&
        timeDifference <= maxValidityDuration
      ) {
        user.isConfirmed = true;
        user.confirmCodeId = null;
        return this.userRepository.save(user);
      }
    }

    throw new BadRequestException('Confirmation error');
  }
}
