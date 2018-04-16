import { Room } from "colyseus";

export class ChatRoom extends Room<any> {
  maxClients = 4;

  onInit (options) {
    this.setState({ messages: [] });
  }

  async onAuth (options) {
    return { success: true };
  }

  onJoin (client, options, auth) {
    this.state.messages.push(`${ client.id } joined.`);
  }

  requestJoin (options, isNewRoom: boolean) {
    return (options.create)
      ? (options.create && isNewRoom)
      : this.clients.length > 0;
  }

  onLeave (client) {
    this.state.messages.push(`${ client.id } left.`);
  }

  onMessage (client, data) {
    this.state.messages.push(data);
  }

}
