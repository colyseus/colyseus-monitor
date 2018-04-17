//
// Monkey-patch Colyseus' default behaviour
//
import { Room, Client } from "colyseus";
import * as msgpack from "notepack.io";

(<any>Room.prototype).getRoomListData = async function () {
    const stateSize = this._previousStateEncoded.byteLength;
    const elapsedTime = this.clock.elapsedTime;
    const locked = this.locked;
    const data = await this.getAvailableData();

    return { ...data, locked, elapsedTime, stateSize };
};

(<any>Room.prototype).getInspectData = async function () {
    const state = this.state;
    const stateSize = this._previousStateEncoded.byteLength;
    const data = await this.getAvailableData();
    const clients = this.clients.map((client: Client) => (
        { id: client.id, sessionId: client.sessionId }
    ));
    const locked = this.locked;

    return { ...data, locked, clients, state, stateSize };
};

// Actions
(<any>Room.prototype)._forceClientDisconnect = async function (sessionId) {
    for (let i = 0; i < this.clients.length; i++) {
        if (this.clients[i].sessionId === sessionId) {
            this.clients[i].close();
            break;
        }
    }
};

(<any>Room.prototype)._sendMessageToClient = async function (sessionId, data) {
    for (let i = 0; i < this.clients.length; i++) {
        if (this.clients[i].sessionId === sessionId) {
            this.send(this.clients[i], data);
            break;
        }
    }
};
