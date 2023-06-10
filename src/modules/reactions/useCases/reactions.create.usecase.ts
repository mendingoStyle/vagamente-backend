import { Injectable } from "@nestjs/common";
import { ReactionsValidator } from "../validators/reactions.validator";
import { ReactionsRepository } from "../reactions.repository";
import { CreateReaction } from "../dto/reactions.create.dto";
import { NotificationsService } from "modules/notifications/notifications.service";
import { PostsService } from "modules/posts/posts.service";
import { PostsRepository } from "modules/posts/posts.repository";
import { UsersRepository } from "modules/users/users.repository";
import { NotificationsEnum } from "database/schemas/notifications.schema";


@Injectable()
export class CreateReactionsUseCase {
    constructor(
        private validator: ReactionsValidator,
        private repository: ReactionsRepository,
        private notificationsService: NotificationsService,
        private postsRepository: PostsRepository,
        private userRepository: UsersRepository

    ) { }
    async create(reaction: CreateReaction, user_id: string) {
        this.sendNotificationsToOwner(reaction, user_id)
        this.validator.validateToSave(reaction)
        return this.repository.create(reaction, user_id)
    }

    async sendNotificationsToOwner(reaction: CreateReaction, user_id: string) {
        if (reaction.deleted_at || reaction.type === 'dislike') {
            return
        }
        const post = await this.postsRepository.findByid(reaction.post_id)
        if (user_id === post.user_id.toString()) {
            return
        }
        const user = await this.userRepository.findOneById(user_id)
        await this.notificationsService.create({
            created_at: new Date(),
            updated_at: new Date(),
            deleted_at: null,
            title: 'reagiu a sua publicação',
            url: process.env.FRONT_URL + 'post/' + post._id,
            isRead: false,
            to_user_id: post.user_id,
            from_user_id: user_id,
            type: NotificationsEnum.notification
        }, user)
    }
}