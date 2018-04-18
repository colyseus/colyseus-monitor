import * as http from "http";
import * as express from "express";
import * as cors from "cors";
import * as path from "path";

import { Server, RedisPresence } from "colyseus";
import { ChatRoom } from "./ChatRoom";
import { monitor } from "../src";

const port = Number(process.env.PORT || 2567);
const endpoint = "localhost";

const app = express();
app.use(cors());

//
// DO NOT USE COPY THIS BLOCK ON YOUR ENVIRONMENT
// development only
//
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackConfig = require("../webpack.config");
app.use(webpackDevMiddleware(webpack(webpackConfig({ })), { }));

// Create HTTP & WebSocket servers
const server = http.createServer(app);
const gameServer = new Server({
    server,
    // presence: new RedisPresence()
});

// Register ChatRoom as "chat"
gameServer.register("chat", ChatRoom);

app.use("/colyseus", monitor(gameServer));

gameServer.listen(port);

console.log(`Listening on ws://${ endpoint }:${ port }`)