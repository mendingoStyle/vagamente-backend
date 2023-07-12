import { IsEmail, IsNotEmpty, IsOptional } from "@nestjs/class-validator";
import { FileValidator } from "@nestjs/common";

export class CreateUser {
    name: string;

    birth_date: Date;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    avatar: string;

    cape: string;

    biography: string

    @IsNotEmpty()
    username: string;

    created_at: Date;

    updated_at: Date;

    deleted_at: Date;
}


export class EditUser {
    _id?: string

    name?: string;

    birth_date?: Date;

    password?: string;

    email?: string;

    oldPassword?: string

    avatar?: string;

    username?: string;

    created_at?: Date;

    updated_at?: Date;

    deleted_at?: Date;

    firstLogin?: boolean

    cape?: string

    biography?: string


}

export class LoginInfoRegister {
    user_id: string
    created_at: Date
}


