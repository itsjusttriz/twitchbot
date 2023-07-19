import { Permissions } from "../utils/constants";
import { Command } from "../utils/interfaces";

export const command = {
    name: 'echo',
    permission: Permissions.OWNER,
    requiresInput: true,
    blacklisted_channels: ['stackupdotorg'],
    run: async opts => {
        await opts.chatClient.say(opts.channel, opts.msgText);
        return;
    }
} as Command;