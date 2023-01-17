import { Injectable } from "@nestjs/common";
import { CreatePost } from "../dto/posts.create.dto";
import { PostsRepository } from "../posts.repository";
import { Posts } from "database/schemas/posts.schema";


@Injectable()
export class PostsValidator {
    constructor(
    ) { }
    async validateToSave(body: CreatePost): Promise<any> {
       
    }
    async findAllValidate(){
    }

}