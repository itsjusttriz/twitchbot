import { Command } from "../utils/interfaces/Command.js";
import { Permissions } from "../utils/enums/permissions-type.js";

export const command = {
    name: 'echo',
    permission: Permissions.OWNER,
    requiresInput: true,
    blacklisted_channels: ['stackupdotorg'],
    run: async opts => {
        opts.chatClient.say(opts.channel, opts.msgText);
        return;
    }
} as Command;