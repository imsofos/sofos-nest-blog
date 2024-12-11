import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Req, ParseIntPipe, UseGuards, } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CacheInterceptor } from 'src/common/interceptors/cache.interceptor';
import { Action } from 'src/common/enums/action.enum';
import { ForbiddenError, subject } from '@casl/ability';
import { CaslGuard } from 'src/common/guards/casl.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @Post()
  signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.signup(createUserDto);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  findAll() {
    return this.userService.findAll();
  }

  @Patch(':id')
  @UseGuards(CaslGuard)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto, @Req() req) {
    const subjectUser = await this.userService.findById(id);
    ForbiddenError.from(req.ability).throwUnlessCan(Action.Update, subject('User', subjectUser));

    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(CaslGuard)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const subjectUser = await this.userService.findById(id);
    ForbiddenError.from(req.ability).throwUnlessCan(Action.Delete, subject('User', subjectUser));

    return this.userService.remove(id);
  }
}
