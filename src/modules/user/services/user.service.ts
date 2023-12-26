import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../entities/user.entity';
import { BaseService } from 'src/base/base.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConfirmEmailDto } from '../dto/cofirm-email.dto';
import { CodeEntity } from '../entities/code.entity';
import { EmailService } from 'src/modules/email/email.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';

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

  async findOneUser(email: string) {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async createAdmin(email: string) {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async checkIfEmailExcist(email: string): Promise<UserEntity | undefined> {
    const user = await this.findOneUser(email);
    if (!user) {
      throw new BadRequestException(`User with email ${email} does not exist`);
    }
    return user;
  }

  async deleteUser(id: number) {
    const user = await this.get(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.userRepository.remove(user);
    return { message: 'User successfully deleted' };
  }

  private async createConfirmCode() {
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
    const hashedPassword = await bcrypt.hash(user.password, 8);
    const newConfirmCode = await this.createConfirmCode();
    const code = await this.codeRepository.create();
    code.confirmCode = newConfirmCode;
    await this.codeRepository.save(code);
    const newUser = this.userRepository.create({
      ...user,
      password: hashedPassword,
      confirmCodeId: code.id,
    });
    const emailDto = new ConfirmEmailDto();
    emailDto.code = code.confirmCode;
    emailDto.email = user.email;
    await this.emailService.sendEmail(emailDto);
    // console.log(code.confirmCode);
    return this.userRepository.save(newUser);
  }

  async findById(id: number): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({
      where: { id: id },
      relations: ['articles'],
    });
  }
  async sendCodeAgain(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.findOneUser(forgotPasswordDto.email);
    if (user) {
      const newConfirmCode = await this.createConfirmCode();
      const emailDto = new ConfirmEmailDto();
      emailDto.code = newConfirmCode;
      emailDto.email = user.email;
      await this.emailService.sendEmail(emailDto);
      const code = await this.codeRepository.create();
      code.confirmCode = newConfirmCode;
      await this.codeRepository.save(code);
      user.confirmCodeId = code.id;
      await this.userRepository.save(user);
    }
    return;
  }

  async activateUser(confirmEmailDto: ConfirmEmailDto) {
    const user: UserEntity = await this.checkIfEmailExcist(
      confirmEmailDto.email,
    );
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

    throw new BadRequestException('Confirmation error');
  }

  async changePassword(user: UserEntity, changePasswordDto: ChangePasswordDto) {
    const newPassword = await bcrypt.hash(changePasswordDto.newPassword, 8);
    user.password = newPassword;
    return this.userRepository.save(user);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.checkIfEmailExcist(dto.email);
    const code = new CodeEntity();
    const confirmCode = await this.createConfirmCode();
    const hashedCode = await bcrypt.hash(confirmCode, 5);
    code.confirmCode = hashedCode;
    await this.codeRepository.save(code);
    user.passwordRecoveryCodeId = code.id;
    await this.userRepository.save(user);
    const data = new ConfirmEmailDto();
    data.code = confirmCode;
    data.email = dto.email;
    await this.emailService.sendPasswordChangeCode(data);
    return {
      message: 'Code sent to your email',
    };
  }

  async getAllUsers() {
    return await this.userRepository.find();
  }

  async findOneCode(codeId: number): Promise<CodeEntity> {
    const code = await this.codeRepository.findOne({ where: { id: codeId } });
    if (!code) {
      throw new BadRequestException(
        'Something went wwrong with confirmation code',
      );
    }
    return code;
  }

  async deleteCode(code: CodeEntity) {
    const ifExsist = await this.codeRepository.findOne({
      where: { id: code.id },
    });
    if (ifExsist) {
      return await this.codeRepository.remove(ifExsist);
    }
    return;
  }
}
