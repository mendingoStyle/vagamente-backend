import { Injectable } from "@nestjs/common";
import { CreatePost } from "../dto/posts.create.dto";
import { PostsRepository } from "../posts.repository";
import { Posts } from "database/schemas/posts.schema";
import { GetPost } from "../dto/posts.get.dto";


@Injectable()
export class PostsValidator {
    constructor(
    ) { }
    async validateToSave(body: CreatePost): Promise<any> {

    }
    async findAllValidate(dto: GetPost, token: string) {
    }

}