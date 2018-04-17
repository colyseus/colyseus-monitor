import * as http from "superagent";

declare const GAME_SERVER_URL: string;

const ENDPOINT = GAME_SERVER_URL || `${window.location.protocol}//${window.location.host}`;

export function fetchRoomList () {
    return http.get(`${ENDPOINT}/colyseus/api`).
      accept('application/json');
}

export function fetchRoomData (roomId: string) {
    return http.get(`${ENDPOINT}/colyseus/api/room`).
        query({ roomId }).
        accept('application/json');
}

export function remoteRoomCall(roomId: string, method: string, ...args: any[]) {
    return http.get(`${ENDPOINT}/colyseus/api/room/call`).
        query({ roomId, method, args: JSON.stringify(args) }).
        accept('application/json');
}