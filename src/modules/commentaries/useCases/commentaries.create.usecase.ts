import { Injectable } from "@nestjs/common";
import { CreateCommentary } from "../dto/commentaries.create.dto";
import { CommentariesValidator } from "../validators/commentaries.validator";
import { CommentariesRepository } from "../commentaries.repository";
import { NotificationsService } from "modules/notifications/notifications.service";
import { PostsRepository } from "modules/posts/posts.repository";
import { UsersRepository } from "modules/users/users.repository";
import { NotificationsEnum } from "database/schemas/notifications.schema";



@Injectable()
export class CreateCommentariesUseCase {
    constructor(
        private validator: CommentariesValidator,
        private repository: CommentariesRepository,
        private notificationsService: NotificationsService,
        private postsRepository: PostsRepository,
        private userRepository: UsersRepository
    ) { }
    async create(body: CreateCommentary, user_id: string) {
        body.user_id = user_id
        body.route_post_id = body.post_id
        if (body.answer_id) {
            body.post_id = undefined
        }
        this.validator.validateToSave(body)
        this.sendNotificationsToOwner(body)
        return this.repository.create(body)
    }
    async sendNotificationsToOwner(body: CreateCommentary) {
        let post = null, father = null, answer = null

        if (body?.route_post_id)
            post = await this.postsRepository.findByid(body.route_post_id)

        father = await this.repository.incrementFathers(body)

        if (body.answer_id)
            answer = await this.repository.findByid(body.answer_id)

        const user = await this.userRepository.findOneById(body.user_id)
 
        if (post?.user_id?.toString() !== answer?.user_id?.toString() && body.user_id.toString() !== post.user_id.toString())
            await this.notificationsService.create({
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
                title: 'comentou na sua publicação',
                url: `${process.env.FRONT_URL}post/${post?._id ? post._id : father._id}`,
                isRead: false,
                to_user_id: post?.user_id ? post.user_id : father.user_id,
                from_user_id: user._id,
                type: NotificationsEnum.notification
            }, user)

        if (answer && answer.user_id.toString()!== user._id.toString()) {
            await this.notificationsService.create({
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
                title: 'respondeu o seu comentário',
                url: `${process.env.FRONT_URL}post/${answer.route_post_id}`,
                isRead: false,
                to_user_id: answer.user_id,
                from_user_id: user._id,
                type: NotificationsEnum.notification
            }, user)
        }



    }
}