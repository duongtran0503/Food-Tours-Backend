import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } }) 
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() 
  server: Server;

  private activeClients = new Set<string>();

  handleConnection(client: Socket) {
    this.activeClients.add(client.id);
    // In ra Terminal của Backend để bạn biết có người vừa kết nối thành công
    console.log(`[Socket] 🟢 Có người vừa kết nối: ${client.id} | Tổng: ${this.activeClients.size}`);
    
    this.server.emit('onlineUsersCount', this.activeClients.size);
  }

  handleDisconnect(client: Socket) {
    this.activeClients.delete(client.id);
    console.log(`[Socket] 🔴 Đã ngắt kết nối: ${client.id} | Tổng: ${this.activeClients.size}`);
    
    this.server.emit('onlineUsersCount', this.activeClients.size);
  }
}