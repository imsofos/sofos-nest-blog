import { Transform } from "class-transformer";
import { IsBoolean, IsString } from "class-validator";

export class CreatePostDto {

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    is_public?: boolean;
}