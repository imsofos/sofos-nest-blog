import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/providers/prisma.service';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  saltOrRounds: number = 10
  constructor(private readonly prismaService: PrismaService) { }

  async signup(createUserDto: CreateUserDto) {
    const hashedPassword = await hash(createUserDto.password, this.saltOrRounds)
    const user = await this.prismaService.user.create({
      data: {
        username: createUserDto.username,
        password: hashedPassword
      }
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword
  }

  findAll() {
    return `This action returns all user ${Date.now()}`;
  }

  async findOne(username: string) {
    return this.prismaService.user.findUnique({
      where: { username }
    });
  }
  async findById(id: number) {
    return this.prismaService.user.findFirst({
      where: { id }
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
