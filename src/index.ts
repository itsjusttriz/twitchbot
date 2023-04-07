import { loadCommands } from "./controllers/CommandController";
import { loadEvents } from "./controllers/EventController";
import { client } from "./controllers/IJTClient";

(async () => {
    (await client.createChatClient()).connect();
    await loadEvents();
    await loadCommands();
})();