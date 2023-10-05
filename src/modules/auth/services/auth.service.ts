import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../user/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';

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
    // В этом методе вы можете использовать ваш UserService
    // для поиска пользователя по его ID
    const user = await this.userService.findById(id);
    return user || null; // Если пользователь не найден, возвращаем null
  }
}
