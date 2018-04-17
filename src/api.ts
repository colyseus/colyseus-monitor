import { Server } from "colyseus";
import * as express from "express";

export function getAPI (server: Server) {
    const api = express.Router();
    const handlers = Object.keys(server.matchMaker.handlers);

    api.get("/", (req: express.Request, res: express.Response) => {
        const result: any = {};

        Promise.all(
            handlers.map((handler) => {
                return server.matchMaker.
                    getAllRooms(handler, 'getRoomListData').
                    then((rooms: any[]) => {
                        result[handler] = rooms;
                    }).
                    catch((err) => console.error(err));
            })
        ).then(() => res.json(result));
    });

    api.get("/room", (req: express.Request, res: express.Response) => {
        const roomId = req.query.roomId;

        server.matchMaker.
            remoteRoomCall(roomId, "getInspectData").
            then((data: any) => res.json(data)).
            catch((err) => console.error(err));
    });

    api.get("/room/call", (req: express.Request, res: express.Response) => {
        const roomId = req.query.roomId;
        const method = req.query.method;
        const args = JSON.parse(req.query.args);

        server.matchMaker.
            remoteRoomCall(roomId, method, args).
            then((data: any) => res.json(data)).
            catch((err) => console.error(err));
    });

    return api;
}
