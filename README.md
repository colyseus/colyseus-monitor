# @colyseus/monitor

Web Monitoring Panel for [Colyseus](https://github.com/colyseus/colyseus)

<img src="media/demo.gif?raw=true" />

Consider backing Colyseus development and its support on Patreon.

<a href="https://www.patreon.com/bePatron?u=3301115"><img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" /></a>

You can use an express middleware to enable authentication on the monitor route, such as `express-basic-middleware`:

```typescript
import * as basicAuth from "express-basic-auth";

const basicAuthMiddleware = basicAuth({
    // list of users and passwords
    users: {
        "admin": "admin",
    },
    // sends WWW-Authenticate header, which will prompt the user to fill
    // credentials in
    challenge: true
});

app.use("/colyseus", basicAuthMiddleware, monitor(gameServer));
```

## Development

Install the dependencies and start the dev-server:

```
npm install
npm start
```

Access the UI on [http://localhost:2567/colyseus](http://localhost:2567/colyseus).

## License

MIT
