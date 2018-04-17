# @colyseus/monitor

Web monitoring panel for [Colyseus](https://github.com/gamestdio/colyseus) (v0.9.5+)

**This library is experimental. Use at your own risk.**

<img src="media/screenshot.png?raw=true" />

Consider backing Colyseus development and its support on Patreon.

<a href="https://www.patreon.com/bePatron?u=3301115"><img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" /></a>

## Usage

```typescript
import * as express from "express";
import * as cors from "cors";

import { Server } from "colyseus";
import { monitor } from "@colyseus/monitor";

const app = express();

// Cross-Origin Resource Sharing is necessary if you use a different IP
// addresses for client and server.
app.use(cors());

const server = http.createServer(app);
const gameServer = new Server({ server });

// Register your room handlers.
gameServer.register("chat", ChatRoom);

// Register monitor route AFTER registering your room handlers
app.use("/colyseus", monitor(gameServer));

gameServer.listen(port);
```

## License

MIT
