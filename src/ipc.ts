import * as memshared from "memshared";

export const IPC_STATS_MESSAGE = '$cstats';

(<any>memshared)[IPC_STATS_MESSAGE] = function(key, callback) {
    if (!memshared.isMasterNode()) {

        // not a master node
        let memory = process.memoryUsage();
        let cpu = process.cpuUsage();

        memshared.store.dispatch(IPC_STATS_MESSAGE, callback, key);

    } else {
        delete memshared.store[key];
        return "OK";
    }
}