import { IsEmail, IsNotEmpty, IsOptional } from "@nestjs/class-validator";

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


export class EditUser {
    _id: string

    name: string;

    birth_date: Date;

    @IsEmail()
    @IsOptional()
    email: string;

    avatar: string;

    username: string;

    created_at: Date;

    updated_at: Date;

    deleted_at: Date;

    password: string;
}

