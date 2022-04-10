import { ExtendedClient } from "./auth-provider.js";

export class CommandOptions
{
    /**
     * 
     * @param {string} channel 
     * @param {import("tmi.js").ChatUserstate} tags 
     * @param {string} msg 
     * @param {boolean} self 
     * @param {ExtendedClient} client 
     */
    constructor(channel, tags, msg, self, client)
    {
        //? Initial properties.
        this.channel = channel;
        this.tags = tags;
        this.msg = msg;
        this.self = self;
        this.client = client;

        //? Custom Properties.
        this.args = (this.msg).slice(1).split(' ');
        this.command = (this.args).shift().toLowerCase();
        this.msgText = (this.args).join(' ');
    }
}