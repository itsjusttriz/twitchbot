import { ChatUserstate } from "tmi.js";
import { IJTTwitchClient } from "../controllers/IJTClient.js";

export class MessageOptions {

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

    get chatClient() {
        return this.client.chat;
    }
}