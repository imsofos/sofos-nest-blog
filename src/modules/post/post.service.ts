import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/db/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { accessibleBy } from '@casl/prisma';
import { Model, PrismaQuery } from '@casl/prisma';
import { Post } from '@prisma/client';
import { UpdatePostDto } from './dto/update-post.dto';
type PostWhereInput = PrismaQuery<Model<Post, 'Post'>>;

@Injectable()
export class PostService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(createPostDto: CreatePostDto, author_id: number, imagePath: string) {
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

    async findAll(ability) {
        const result = this.prismaService.post.findMany({
            where: accessibleBy(ability).Post
        });
        return result;
    }


    async findById(ability: any, id: number) {
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

    async update(ability: any, id: number, post: UpdatePostDto) {
        const curPost = await this.findById(ability, id);
        if (!curPost) throw new NotFoundException();

        const result = this.prismaService.post.update({
            data: post,
            where: { id }
        });

        return result;
    }

    async delete(ability: any, id: number) {
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

