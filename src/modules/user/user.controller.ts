import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './services/user.service';

@ApiTags('Users for admin')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get list of all users' })
  @Get()
  async getAll() {
    return await this.userService.getAllUsers();
  }

  @ApiOperation({ summary: 'Get one user by email' })
  @Get('email')
  async getByEmail(@Param('email') email: string) {
    return await this.userService.findOneUser(email);
  }

  @ApiOperation({ summary: 'Get one user by id' })
  @Get(':id')
  async getById(@Param('id') id: number) {
    return await this.userService.get(id);
  }

  @ApiOperation({ summary: 'Delete user by id' })
  @Delete(':id')
  async deleteById(@Param('id') id: number) {
    return await this.userService.deleteUser(id);
  }
}
