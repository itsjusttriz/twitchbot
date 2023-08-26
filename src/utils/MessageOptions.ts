import { ChatUserstate } from 'tmi.js';
import { ClientController } from '../controllers/client.controller.js';
import { dehashChannel } from '../helper/dehash-channels.js';

export class MessageOptions {
    channel: string;
    tags: ChatUserstate;
    msg: string;
    self: boolean;
    client: typeof ClientController;

    args: string[];
    command: string;
    msgText: string;
    user: string;

    constructor(channel: string, tags: ChatUserstate, msg: string, self: boolean, client: typeof ClientController) {
        //? Initial properties.
        this.channel = channel;
        this.tags = tags;
        this.msg = msg;
        this.self = self;
        this.client = client;

        //? Custom Properties.
        this.args = this.msg.slice(1).split(' ');
        this.command = this.args.shift().toLowerCase();
        this.msgText = this.args.join(' ');
        this.user = this.tags.username;
    }

    // TODO: Create mention clause, channel-based config dependant.

    get chatClient() {
        return this.client.chat;
    }

    get dehashedChannel() {
        return dehashChannel(this.channel);
    }
}
