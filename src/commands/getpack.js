import { CommandOptions } from "../utils/command-options.js";
import fetch from "node-fetch";

export default {
    name: 'getpack',
    permission: ['mod'],

    /**
     * 
     * @param {CommandOptions} opts 
     */
    run: async (opts) =>
    {
        if (!opts.msgText)
            return;
        if (!opts.args.length > 1)
            return;

        const pack = await getPackFromApi(opts.args[0]);
        if (!pack)
            return opts.client.say(opts.channel, 'Cannot find this modpack.');

        const msg = `Requested modpack is called ${pack.name}. Created by ${pack.dev}. Known Status: ${pack.type}.${(pack.launcher !== 'null' && pack.link !== 'null') ? ` Found here: ${pack.link}` : ''}`;
        return opts.client.say(opts.channel, msg);
    }
}

async function getPackFromApi(id)
{
    const api = await fetch(`https://api.itsjusttriz.com/minecraft/get/${id}?raw=true`);
    if (api.status !== 200)
        return;
    return (await api.json()).payload
}