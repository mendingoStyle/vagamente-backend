import { Injectable } from "@nestjs/common";
import { createPost } from "../dto/posts.create.dto";
import { PostsRepository } from "../posts.repository";
import { Posts } from "database/schemas/posts.schema";


@Injectable()
export class PostsValidator {
    constructor(
    ) { }
    async validateToSave(body: createPost): Promise<any> {
       
    }
    async findAllValidate(){
    }

}