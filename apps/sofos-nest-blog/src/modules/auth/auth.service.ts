import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) { }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userService.findOne(loginDto.username);
    if (!user) throw new UnauthorizedException();
    const validPassword = await compare(loginDto.password, user?.password);

    if (!user || !validPassword) {
      throw new UnauthorizedException();
    }

    const payload = { id: user.id, role: user.role };

    return {
      accessToken: await this.jwtService.signAsync(payload)
    }
  }

}
