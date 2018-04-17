import * as express from 'express';
import * as path from "path";
import { Server } from "colyseus";
import { getAPI } from './api';
import './ext/Room';

const frontendDirectory = path.resolve(__dirname, "..", "lib", "static");

export function monitor (server: Server) {
    const stats = express.Router();
    stats.use('/', express.static(frontendDirectory));
    stats.use('/api', getAPI(server));
    return stats;
}
