import { IsEmail, IsNotEmpty } from "@nestjs/class-validator";

export class CreateUser {
    name: string;

    birth_date: Date;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    avatar: string;

    @IsNotEmpty()
    username: string;

    created_at: Date;

    updated_at: Date;

    deleted_at: Date;
}
