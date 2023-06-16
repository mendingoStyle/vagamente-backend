import { Module } from '@nestjs/common'
import { SocketGateway } from './socket.gateway';
import { UsersSocketModule } from 'modules/usersSocket/usersSocket.module';
import { TokenModule } from 'modules/token/tokenController.module';

@Module({
    providers: [
        SocketGateway
    ],
    imports: [UsersSocketModule, TokenModule],
    exports: [SocketGateway]
})
export class SocketModule { }
