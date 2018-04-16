import * as http from "http";
import * as express from "express";
import * as cors from "cors";

import { Server } from "colyseus";
import { ChatRoom } from "./ChatRoom";
import { statsFor } from "../src";

const port = Number(process.env.PORT || 2567);
const endpoint = "localhost";

const app = express();
app.use(cors());

// Create HTTP & WebSocket servers
const server = http.createServer(app);
const gameServer = new Server({ server });

// Register ChatRoom as "chat"
gameServer.register("chat", ChatRoom);

app.use("/colyseus", statsFor(gameServer));

gameServer.listen(port);

console.log(`Listening on ws://${ endpoint }:${ port }`)