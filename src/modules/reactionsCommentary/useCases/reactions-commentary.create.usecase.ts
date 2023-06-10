import { Injectable } from "@nestjs/common";
import { CreateReactionCommentary } from "../dto/reactions-commentary.create.dto";
import { ReactionsCommentaryValidator } from "../validators/reactions-commentary.validator";
import { ReactionsCommentaryRepository } from "../reactions-commentary.repository";
import { CommentariesRepository } from "modules/commentaries/commentaries.repository";
import { NotificationsService } from "modules/notifications/notifications.service";
import { UsersRepository } from "modules/users/users.repository";
import { NotificationsEnum } from "database/schemas/notifications.schema";


@Injectable()
export class CreateReactionsUseCase {
    constructor(
        private validator: ReactionsCommentaryValidator,
        private repository: ReactionsCommentaryRepository,
        private commentariesRepository: CommentariesRepository,
        private notificationsService: NotificationsService,
        private userRepository: UsersRepository

    ) { }
    async create(reaction: CreateReactionCommentary, user_id: string) {
        this.sendNotificationsToOwner(reaction, user_id)
        this.validator.validateToSave(reaction)
        return this.repository.create(reaction, user_id)
    }

    async sendNotificationsToOwner(reaction: CreateReactionCommentary, user_id: string) {
        if (reaction.deleted_at || reaction.type === 'dislike') {
            return
        }
        const commentaryReaction = await this.commentariesRepository.findByid(reaction.commentary_id)
        const user = await this.userRepository.findOneById(commentaryReaction.user_id)

        this.notificationsService.create({
            created_at: new Date(),
            updated_at: new Date(),
            deleted_at: null,
            title: 'reagiu ao seu comentário',
            url: process.env.FRONT_URL + 'post' + `/${commentaryReaction.route_post_id}`,
            isRead: false,
            to_user_id: commentaryReaction.user_id,
            from_user_id: user_id,
            type: NotificationsEnum.notification
        }, user)
    }
}
