import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    username: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    password: string;
}