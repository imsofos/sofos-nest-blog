import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    @Length(3, 30, { message: 'Username must be between 3 and 30 characters long.' })
    @Transform(({ value }) => value.trim())
    username: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 99)
    @Transform(({ value }) => value.trim())
    password: string;

}
