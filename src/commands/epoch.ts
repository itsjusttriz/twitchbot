import { Command } from '../utils/interfaces';

export const command = {
    name: 'epoch',
    permission: 'REGULAR',
    requiresInput: true,
    minArgs: 1,
    min_args_error_message: 'Please provide a timestamp, like so: 2023-01-01T09:00',
    maxArgs: 1,
    maxArgsErrorMessage: 'Too many arguments. Try again!',
    blacklisted_channels: ['stackupdotorg'],
    run: async (opts) => {
        const regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;
        if (!regex.test(opts.msgText)) {
            await opts.chatClient.say(opts.channel, 'Invalid Timestamp. Format must be: yyyy-mm-ddTHH:MM');
            return;
        }

        const epoch = new Date(opts.msgText).getTime() / 1000;
        await opts.chatClient.say(opts.channel, epoch.toString());
        return;
    },
} as Command;
