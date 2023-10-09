import {
  Patch,
  Controller,
  Post,
  Req,
  Body,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserService } from '../user/services/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { ConfirmEmailDto } from '../user/dto/cofirm-email.dto';
import { LoginDto } from '../user/dto/login-dto';
import { ForgotPasswordDto } from '../user/dto/forgot-password.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { ChangePasswordDto } from '../user/dto/change-password.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Registration' })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findOneUser(
      createUserDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    return await this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Account activation' })
  @Post('confirmEmail')
  async confirmEmail(@Body() confirmEmailDto: ConfirmEmailDto) {
    const existingUser = await this.userService.findOneUser(
      confirmEmailDto.email,
    );
    if (!existingUser) {
      throw new BadRequestException('Email does not exists');
    }
    const user = await this.userService.activateUser(confirmEmailDto);
    return this.authService.generateToken(user);
  }

  @ApiOperation({ summary: 'Login' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.userService.findOneUser(loginDto.email);
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
  @ApiOperation({
    summary: 'Forgot password (Sends password changing code to email)',
  })
  @Post('forgotPassword')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.userService.forgotPassword(forgotPasswordDto);
  }

  @ApiOperation({
    summary: 'Code confirmation for changing password (Returns access token)',
  })
  @Post('confirmCode')
  async confirmCodeToChangePassword(@Body() confirmEmailDto: ConfirmEmailDto) {
    const user = await this.userService.findOneUser(confirmEmailDto.email);

    const code = await this.userService.findOneCode(
      user.passwordRecoveryCodeId,
    );
    const currentTime = new Date();
    const createdAt = code.createdAt;
    const timeDifference = currentTime.getTime() - createdAt.getTime();
    const maxValidityDuration = 15 * 60 * 1000;
    if (timeDifference > maxValidityDuration) {
      throw new BadRequestException('The code has expired');
    }
    const codeMatch = await bcrypt.compare(
      confirmEmailDto.code,
      code.confirmCode,
    );
    if (!codeMatch) {
      throw new BadRequestException('Invalid code');
    }
    if (codeMatch) {
      await this.userService.deleteCode(code);
    }
    return this.authService.generateToken(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password only for authorized users' })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: any,
  ) {
    return this.authService.changePassword(req.user?.email, changePasswordDto);
  }
}
