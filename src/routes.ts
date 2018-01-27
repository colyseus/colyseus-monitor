import * as memshared from "memshared";
import { Router } from "express";
import { STATS_KEY } from "./index";

export const stats = Router();

stats.get("/", (req, res) => {
    let statsPerWorker: any;

    memshared.hgetall(STATS_KEY, (err, data) => {
        statsPerWorker = data;
    });

    let roomCounts = {};
    memshared.lrange("workerIds", 0, -1, (err, workerIds) => {
        memshared.mget(workerIds, (err, spawnedRoomCounts) => {

            console.log(statsPerWorker);
            console.log(spawnedRoomCounts);

            res.json({
            });
        });
    });

});