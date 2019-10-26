import express from 'express';
import path from "path";
import { Server } from "colyseus";
import { getAPI } from './api';
import './ext/Room';

const frontendDirectory = path.resolve(__dirname, "..", "lib", "static");

/**
 * TODO: expose the `router` instead on next major version.
 * The `server` is not necessary anymore since colyseus@0.11.19
 */
export function monitor (server?: Server): express.Router {
    const router = express.Router();
    router.use('/', express.static(frontendDirectory));
    router.use('/api', getAPI());
    return router;
}
