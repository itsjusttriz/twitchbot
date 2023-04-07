import { Command } from "../utils/interfaces/Command.js";
import { Permissions } from "../utils/enums/permissions-type.js";

export const command = {
    name: 'epoch',
    permission: Permissions.REGULAR,
    requiresInput: true,
    maxArgs: 1,
    maxArgsErrorMessage: 'Too many arguments. Try again!',
    blacklisted_channels: ['stackupdotorg'],
    run: async opts => {
        if (!opts.msgText) {
            opts.chatClient.say(opts.channel, 'No msgText detected. Try again!');
            return;
        }

        const regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;

        if (!regex.test(opts.msgText)) {
            opts.chatClient.say(opts.channel, 'Invalid Timestamp. Format must be: yyyy-mm-ddTHH:MM');
            return;
        }

        const epoch = new Date(opts.msgText).getTime() / 1000;
        opts.chatClient.say(opts.channel, epoch.toString());
        return;
    }
} as Command;