import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, NotFoundException, Logger, Inject, } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Action } from '../../common/enums/action.enum';
import { ForbiddenError, subject } from '@casl/ability';
import { CaslGuard } from '../../common/guards/casl.guard';
import { Ability } from '../../common/decorators/ability.decorator';
import { AppAbility } from '../casl/caslAbility.factory';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('user')
export class UserController {
  // private readonly logger = new Logger(UserController.name, { timestamp: true });
  constructor(
    private readonly userService: UserService,
    @Inject('ANALYTICS') private readonly analyticsClient: ClientProxy
  ) { }

  @Post()
  signup(@Body() createUserDto: CreateUserDto) {
    const result = this.userService.signup(createUserDto);
    this.analyticsClient.emit('user_created', createUserDto);
    return result
  }

  @Get('analytics')
  getAnalytics(): Observable<number> {
    return this.analyticsClient.send({ cmd: 'analytics' }, {});
  }

  @Get()
  findAll() {
    // this.logger.log('log');
    return this.userService.findAll();
  }

  @Patch(':id')
  @UseGuards(CaslGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Ability() ability: AppAbility) {
    const subjectUser = await this.userService.findById(id);
    if (!subjectUser) {
      throw new NotFoundException();
    }
    ForbiddenError.from(ability).throwUnlessCan(Action.Update, subject('User', subjectUser));

    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(CaslGuard)
  async remove(@Param('id', ParseIntPipe) id: number, @Ability() ability: AppAbility) {
    const subjectUser = await this.userService.findById(id);
    if (!subjectUser) {
      throw new NotFoundException();
    }
    ForbiddenError.from(ability).throwUnlessCan(Action.Delete, subject('User', subjectUser));

    return this.userService.remove(id);
  }
}
