import { IsString, Length } from "class-validator";

export class CreateUserDto {

    @IsString()
    username: string;

    @IsString()
    @Length(8, 99)
    password: string;

}
