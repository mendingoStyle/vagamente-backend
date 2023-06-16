import { Injectable, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { UsersSocketService } from "modules/usersSocket/usersSocket.service";
import { Server, Socket } from 'socket.io';
import { SendNotificationsDto } from "./dto/send.notifications.dto";
import { Notifications } from "database/schemas/notifications.schema";
import { JwtAuthGuard } from "modules/auth/guard/jwt-auth.guard";
import { TokenService } from "modules/token/tokenController.service";
import { UtilsService } from "modules/utils/utils.service";


@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
@Injectable()
export class SocketGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;
    constructor(
        private usersSocketService: UsersSocketService,
        private readonly tokenService: TokenService,
    ) {

    }
    async handleConnection(client: Socket) {
        try {
            await this.tokenService.verifyToken(client?.handshake?.headers?.authorization)
        } catch (e) {
            console.log(client?.handshake?.headers?.authorization)
            return
        }
        if (client.id && client?.handshake?.headers?.userid) {
            this.usersSocketService.create({ user_id: client?.handshake?.headers?.userid, socket_id: client.id })
            console.log(`client connected ${client.id}`)
        }
    }
    async handleDisconnect(client: Socket) {
        await this.usersSocketService.delete(client.id)
        console.log(`client disconnected ${client.id}`)
    }

    async sendNotifications(notifications: SendNotificationsDto) {
        const usersId = await this.usersSocketService.findAll({ user_id: notifications.to_user_id })
        if (usersId && usersId.length > 0) {
            if (notifications.type === 'notification')
                this.server
                    .to(usersId.map(user => user.socket_id))
                    .emit('notifications', notifications);
            if (notifications.type === 'friendRequest')
                this.server
                    .to(usersId.map(user => user.socket_id))
                    .emit('friendship', notifications);
        }
    }
    /*
    @SubscribeMessage('onRefresh')
    handleEvent(
        @MessageBody() data: string,
        @ConnectedSocket() client: Socket,
    ): string {
        console.log(client?.id)
        console.log(data)
        this.server.sockets.emit('notifications', { message: 'oi eu sou goku' });

        //this.server.emit('notifications', { name: 'oi sou goku' }, (data) => console.log(data));
        return data;
    }
*/

}