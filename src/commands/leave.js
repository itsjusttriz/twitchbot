import fetch from "node-fetch";
import { CommandOptions } from "../utils/command-options.js"

export default {
    name: 'leave',
    permission: 'owner',
    /**
     * 
     * @param {CommandOptions} opts 
     */
    run: async (opts) =>
    {
        if (!opts.msgText)
            return;

        for (const c of opts.args)
        {
            opts.client.part(c)
                .catch(e =>
                {
                    console.log('Failed to leave channel:', opts.args[0]);
                    console.error(e)
                    opts.client.say(opts.channel, 'Failed to leave channel: ' + opts.args[0])
                })
        }
        const stored = await storeChannels(opts.args);
        if (!stored)
            return opts.client.say(opts.channel, 'Failed to store channels.')
    }
}

async function storeChannels(arr)
{
    const qs = new URLSearchParams({ channels: arr.join('|') });
    const api = await fetch(`https://api.itsjusttriz.com/twitch/twitch-bot-channels?${qs}`, { method: 'DELETE' });
    return api.status === 200;
}