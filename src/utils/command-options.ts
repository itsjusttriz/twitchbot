import { ChatUserstate } from "tmi.js";
import { client, IJTTwitchClient } from "./auth-provider.js";

export class CommandOptions {
    channel: string;
    tags: ChatUserstate;
    msg: string;
    self: boolean;
    client: IJTTwitchClient;

    args: string[];
    command: string;
    msgText: string;
    user: string;

    constructor(channel: string, tags: ChatUserstate, msg: string, self: boolean, client: IJTTwitchClient) {
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
        this.user = (this.tags).username;
    }

    // TODO: Create mention clause, channel-based config dependant.

    async getChatClient() {
        return await client.getChatClient();
    }
}