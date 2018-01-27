import * as memshared from "memshared";
import { setInterval } from "timers";

import { stats } from "./routes";

export const STATS_KEY = '$cstats';

export interface StatsOptions {
    interval?: number;
}

if (!memshared.isMasterNode()) {
    process.on("beforeExit", () => memshared.hdel(STATS_KEY, process.pid.toString(), () => {}));

    // send stats to master process at every interval step
    memshared.get(`${STATS_KEY}-interval`, (err, interval) => {
        setInterval(() => {
            memshared.hset(STATS_KEY, process.pid.toString(), {
                memory: process.memoryUsage(),
                cpu: process.cpuUsage()
            });
        }, interval);
    });
}

export function register (options: StatsOptions = {}) {
    memshared.set(`${STATS_KEY}-interval`, options.interval || 5000);
}

export function route (server: any) {
    let handlers = {};

    // for (let id in server.matchMaker.handlers) {
    //     handlers[id] = {};
    //     let handler = server.matchMaker.handlers[id];
    //     handler.
    //         on("create", (room) => console.log("room created!", room.roomId)).
    //         on("join", (room, client) => console.log("client", client.id, "joined", room.roomId)).
    //         on("leave", (room, client) => console.log("client", client.id, "left", room.roomId)).
    //         on("dispose", (room) => console.log("room disposed!", room.roomId));
    // }

    return stats;
}