//
// Monkey-patch Colyseus' default behaviour
//
import { Room, Client, ClientPrivate } from "@colyseus/core";

function getStateSize(room) {
    // TODO: `Serializer<T>` should provide a method for this (e.g. `serializer.hasState()`)
    const hasState = (
      room._serializer.encoder || // schema v3
      room._serializer.state || // schema v2
      room._serializer.previousState // legacy-fossil-delta
    );
    const fullState = hasState && room._serializer.getFullState();
    return fullState && (fullState.byteLength || fullState.length) || 0;
}

(<any>Room.prototype).getAvailableData = function () {
    return {
        clients: this.clients.length,
        maxClients: this.maxClients,
        metadata: this.metadata,
        roomId: this.roomId,
    };
};

(<any>Room.prototype).getRoomListData = async function () {
    const stateSize = getStateSize(this);
    const elapsedTime = this.clock.elapsedTime;
    const locked = this.locked;
    const data = this.getAvailableData();

    return { ...data, locked, elapsedTime, stateSize };
};

(<any>Room.prototype).getInspectData = async function () {
    const state = this.state;
    const stateSize = getStateSize(this);
    const roomElapsedTime = this.clock.elapsedTime;

    const data = this.getAvailableData();
    const clients = this.clients.map((client: Client & ClientPrivate) => ({
        sessionId: client.sessionId,
        elapsedTime: roomElapsedTime - client._joinedAt
    }));
    const locked = this.locked;

    return { ...data, locked, clients, state, stateSize };
};

// Actions
(<any>Room.prototype)._forceClientDisconnect = async function (sessionId) {
    for (let i = 0; i < this.clients.length; i++) {
        if (this.clients[i].sessionId === sessionId) {
            this.clients[i].leave();
            break;
        }
    }
};

(<any>Room.prototype)._sendMessageToClient = async function (sessionId, type, data) {
    for (let i = 0; i < this.clients.length; i++) {
        if (this.clients[i].sessionId === sessionId) {
            this.clients[i].send(type, data);
            break;
        }
    }
};
