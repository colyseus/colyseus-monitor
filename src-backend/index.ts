import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { getAPI } from './api.js';
import './ext/Room.js';

// __dirname is not available in ESM
const getDirname = () => (typeof __dirname !== 'undefined') ? __dirname : path.dirname(fileURLToPath(import.meta.url));
const frontendDirectory = path.resolve(getDirname(), "..", "build", "static");

export interface MonitorOptions {
    columns: Array<
        'roomId' |
        'name' |
        'clients' |
        'maxClients' |
        'locked' |
        'elapsedTime' |
        { metadata: string } |
        'processId' |
        "publicAddress"
    >
}

/**
 * TODO: expose the `router` instead on next major version.
 */
export function monitor (opts: Partial<MonitorOptions> = {}): express.Router {
    const router = express.Router();
    router.use(express.static(frontendDirectory));
    router.use('/api', getAPI(opts));
    return router;
}
