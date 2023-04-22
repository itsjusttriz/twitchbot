import { loadCommands } from "./controllers/CommandController";
import { loadEvents } from "./controllers/EventController";
import { client } from "./controllers/IJTClient";
import { loadBackend } from "./services/uptime-robot";

(async () => {
    (await client.createChatClient()).connect();
    await loadBackend();
    await loadEvents();
    await loadCommands();
})();