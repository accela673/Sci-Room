import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserService } from '../user/services/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { ConfirmEmailDto } from '../user/dto/cofirm-email.dto';
import { LoginDto } from '../user/dto/login-dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    return await this.userService.create(createUserDto);
  }

  @Post('confirmEmail')
  async confirmEmail(@Body() confirmEmailDto: ConfirmEmailDto) {
    const existingUser = await this.userService.findOneByEmail(
      confirmEmailDto.email,
    );
    if (!existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const user = await this.userService.activateUser(confirmEmailDto);
    return this.authService.generateToken(user);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.userService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isConfirmed) {
      throw new BadRequestException('Account is not activated');
    }
    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.generateToken(user);
  }
}
