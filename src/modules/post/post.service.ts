import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/db/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { accessibleBy } from '@casl/prisma';
import { Post } from '@prisma/client';
import { UpdatePostDto } from './dto/update-post.dto';
import { Action } from 'src/common/enums/action.enum';
import { ForbiddenError } from '@casl/ability';
import { AppAbility } from '../casl/caslAbility.factory';
import { permittedFieldsOf } from '@casl/ability/extra';

@Injectable()
export class PostService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(createPostDto: CreatePostDto, author_id: number, imagePath: string): Promise<Post> {
        const result = await this.prismaService.post.create({
            data: {
                title: createPostDto.title,
                description: createPostDto.description,
                slug: slugify(createPostDto.title),
                imagePath,
                author_id,
                is_public: createPostDto.is_public
            }
        });
        return result;
    }

    async findAll(ability: AppAbility): Promise<Post[]> {
        const result = this.prismaService.post.findMany({
            where: accessibleBy(ability).Post
        });
        return result;
    }


    async findById(ability: AppAbility, id: number): Promise<Post | null> {
        const result = this.prismaService.post.findFirst({
            where: {
                AND: [
                    { id },
                    accessibleBy(ability).Post,
                ]
            },
            include: {
                author: { // shows password if select all columns
                    select: {
                        nickname: true
                    }
                }
            }
        });
        return result;
    }

    async update(ability: AppAbility, id: number, updatePostDto: UpdatePostDto): Promise<Post> {

        // // for checking at field level we need the Post instance
        // const userSentFields = Object.getOwnPropertyNames(updatePostDto); // not sure about this
        // const curPost = await this.findById(ability, id);
        // if (!curPost) throw new NotFoundException();
        // const sbj = subject('Post', curPost);

        // // then we have two ways to face it

        // // 1. only passing allowed fields to get updated
        // const premittedFields = getPremittedFields(ability, sbj, userSentFields);

        // // 2. throw if user tried updating forbidden fields
        // throwUnlessCanFields(ability, sbj, userSentFields);

        const result = await this.prismaService.post.update({
            data: updatePostDto,
            where: { id, AND: accessibleBy(ability, Action.Update).Post } // not controlling the fields
        });

        return result;
    }

    async delete(ability: any, id: number): Promise<Post> {
        const curPost = await this.findById(ability, id);
        if (!curPost) throw new NotFoundException();

        const result = this.prismaService.post.delete({
            where: { id }
        });

        return result;
    }
}

function slugify(title: string): string {
    return title.replaceAll(' ', '-').toLowerCase();
}

function throwUnlessCanFields(ability: AppAbility, subject: any, fields: string[]): void {
    for (let i = 0; i < fields.length; i++) {
        ForbiddenError.from(ability).throwUnlessCan(Action.Update, subject, fields[i]);
    }
}

function getPremittedFields(ability: AppAbility, subject: any, fields: string[]): Record<string, any> {
    const permittedFields: string[] = permittedFieldsOf(ability,
        Action.Update,
        subject,
        { fieldsFrom: rule => rule.fields || [''] }
    );
    return fields
        .filter((f: string) => permittedFields.includes(f))
        .reduce((acc: Record<string, any>, f: string) => (acc[f] = fields[f], acc), {});
}