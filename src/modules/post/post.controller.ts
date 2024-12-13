import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { CaslGuard } from 'src/common/guards/casl.guard';
import { User } from 'src/common/decorators/user.decorator';
import { Action } from 'src/common/enums/action.enum';
import { Rules } from 'src/common/decorators/rule.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import { ForbiddenError, subject } from '@casl/ability';
import { UpdatePostDto } from './dto/update-post.dto';
import { Ability } from 'src/common/decorators/ability.decorator';
import { AppAbility } from '../casl/caslAbility.factory';


@Controller('post')
export class PostController {

    constructor(private readonly postService: PostService) { }

    @Post()
    @Rules([{ action: Action.Create, subject: 'Post' }])
    @UseGuards(CaslGuard)
    @UseInterceptors(FileInterceptor('image', multerOptions))
    async create(
        @Body() createPostDto: CreatePostDto,
        @User() author,
        @UploadedFile() file: Express.Multer.File) {
        const result = await this.postService.create(createPostDto, author.id, file.path);
        return result
    }


    @Get()
    @Rules([{ action: Action.Read, subject: 'Post' }])
    @UseGuards(CaslGuard)
    async findAll(@Ability() ability) {
        const result = await this.postService.findAll(ability);
        return result;
    }

    @Get(':id')
    @UseGuards(CaslGuard)
    async findById(@Param('id', ParseIntPipe) id: number, @Ability() ability: AppAbility) {
        const post = await this.postService.findById(ability, id);
        // cheking in service layer or in controller?
        ForbiddenError.from(ability).throwUnlessCan(Action.Read, subject('Post', post));
        if (!post) throw new NotFoundException();
        return post;
    }

    @Patch(':id')
    @UseGuards(CaslGuard)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePostDto: UpdatePostDto,
        @Ability() ability: AppAbility) {
        const post = await this.postService.findById(ability, id);
        ForbiddenError.from(ability).throwUnlessCan(Action.Update, subject('Post', post));
        if (!post) throw new NotFoundException();

        const result = await this.postService.update(ability, id, updatePostDto);
        return result
    }

    @Delete(':id')
    @UseGuards(CaslGuard)
    async delete(
        @Param('id', ParseIntPipe) id: number,
        @Ability() ability: AppAbility) {
        const post = await this.postService.findById(ability, id);
        ForbiddenError.from(ability).throwUnlessCan(Action.Delete, subject('Post', post));
        if (!post) throw new NotFoundException();

        const result = await this.postService.delete(ability, id);
        return result
    }

}
