import express from "express";
import { createServer } from "http";
import { Server, Room, matchMaker } from "colyseus";
import { monitor } from "../src/index";

const port = 2567;
const app = express();

app.use(express.json());
app.use("/", monitor());

const gameServer = new Server({ server: createServer(app) });

/**
 * Define your room handlers:
 */
gameServer.define("my_room", class MyRoom extends Room {
  autoDispose = false;
  maxClients = 8;
});
gameServer.listen(port).then(async () => {
  console.log(`Listening on http://localhost:${port}`)

  /**
   * create multiple dummy rooms
   */
  for (let i=0; i<300; i++) {
    await matchMaker.createRoom("my_room", {});
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // @ts-ignore
  matchMaker.driver.rooms[20].clients = 9;

  // @ts-ignore
  matchMaker.driver.rooms[21].clients = 99;

  // @ts-ignore
  matchMaker.driver.rooms[22].clients = 8;

  // @ts-ignore
  matchMaker.driver.rooms[23].clients = 800;

  // @ts-ignore
  matchMaker.driver.rooms[24].clients = 100;

  // @ts-ignore
  matchMaker.driver.rooms[25].clients = 10;

  // @ts-ignore
  matchMaker.driver.rooms[26].clients = 1;

});
