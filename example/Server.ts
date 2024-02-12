import express from "express";
import { createServer } from "http";
import { Server, Room, matchMaker } from "colyseus";
import { monitor } from "../src/index";

const port = 2567;
const app = express();

app.use(express.json());
app.use("/monitor", monitor());

const gameServer = new Server({ server: createServer(app) });

/**
 * Define your room handlers:
 */
gameServer.define("my_room", class MyRoom extends Room {});
gameServer.listen(port).then(() => {
  console.log(`Listening on http://localhost:${port}`)

  /**
   * create multiple dummy rooms
   */
  for (let i=0; i<3000; i++) {
    matchMaker.createRoom("my_room", {});
  }
});
