import fs from 'fs'
import { client } from "./IJTClient";

export async function loadEvents() {
    const events = fs.readdirSync(process.cwd() + '/dist/events').filter(f => f.endsWith('.js'));
    for (const event of events) {
        const { event: e } = await import(`../events/${event}`);

        if (client.settings.disableEvents || e.isDisabled) {
            console.log(`Found disabled event: ` + e.name);
            continue;
        }

        if (e.once)
            client.chat.once(e.name, (...args) => e.run(...args, client));
        else
            client.chat.on(e.name, (...args) => e.run(...args, client));

    }
}