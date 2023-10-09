import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../user/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';
import { ChangePasswordDto } from 'src/modules/user/dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  generateToken(user: UserEntity) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUserById(id: number): Promise<UserEntity | null> {
    const user = await this.userService.findById(id);
    return user || null;
  }

  async changePassword(email: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userService.checkIfEmailExcist(email);
    const result = await this.userService.changePassword(
      user,
      changePasswordDto,
    );
    return {
      message: 'Password successfully changed',
    };
  }
}
