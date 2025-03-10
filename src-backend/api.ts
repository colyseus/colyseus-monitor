import { matchMaker } from '@colyseus/core';

import express from 'express';
import osUtils from 'node-os-utils';

import type { MonitorOptions } from './index.js';

const UNAVAILABLE_ROOM_ERROR = "@colyseus/monitor: room $roomId is not available anymore.";

export function getAPI (opts: Partial<MonitorOptions>) {
    const api = express.Router();

    api.get("/", async (req: express.Request, res: express.Response) => {
        try {
            const rooms: any[] = await matchMaker.query({});
            const columns = opts.columns || ['roomId', 'name', 'clients', 'maxClients', 'locked', 'elapsedTime'];

            // extend columns to expose "publicAddress", if present
            if (!opts.columns && rooms[0] && rooms[0].publicAddress !== undefined) {
                columns.push("publicAddress");
            }

            let connections: number = 0;

            res.json({
                columns,
                rooms: rooms.map(room => {
                    const data = JSON.parse(JSON.stringify(room));

                    connections += room.clients;

                    // additional data
                    data.locked = room.locked || false;
                    data.private = room.private;

                    data.maxClients = `${room.maxClients}`;

                    data.elapsedTime = Date.now() - new Date(room.createdAt).getTime();
                    return data;
                }),

                connections,
                cpu: await osUtils.cpu.usage(),
                memory: await osUtils.mem.used()
            });
        } catch (e) {
            const message = e.message;
            console.error(message);
            res.status(500);
            res.json({ message });
        }
    });

    api.get("/room", async (req: express.Request, res: express.Response) => {
        const roomId = req.query.roomId as string;
        try {
            const inspectData = await matchMaker.remoteRoomCall(roomId, "getInspectData");
            res.json(inspectData);
        } catch (e) {
            const message = UNAVAILABLE_ROOM_ERROR.replace("$roomId", roomId);
            console.error(message);
            res.status(500);
            res.json({ message });
        }
    });

    api.get("/room/call", async (req: express.Request, res: express.Response) => {
        const roomId = req.query.roomId as string;
        const method = req.query.method as string;
        const args = JSON.parse(req.query.args as string);

        try {
            const data = await matchMaker.remoteRoomCall(roomId, method, args);
            res.json(data);
        } catch (e) {
            const message = UNAVAILABLE_ROOM_ERROR.replace("$roomId", roomId);
            console.error(message);
            res.status(500);
            res.json({ message });
        }
    });

    return api;
}
