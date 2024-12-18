import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        client.broadcast.emit('user-joined', client.id)
        console.log('Client connected:', client.id);
    }

    handleDisconnect(client: Socket) {
        client.broadcast.emit('user-leaved', client.id)
        console.log('Client disconnected:', client.id);
    }

    @SubscribeMessage('chat_message')
    handleMessage( @MessageBody() message: string,
        @ConnectedSocket() client: Socket): string {
        console.log('Received message:', message);
        this.server.emit('chat_message', { message, id: client.id });
        return message;
    }
}