import { ITime } from '@itsjusttriz/utils';
import { Permissions } from '../utils/constants';
import { Command } from '../utils/interfaces';

/**
 * This command is strictly used for the StackUpDotOrg channel for when Finncapp is live on the ChromaCage MC server.
 */

export const command = {
    name: 'drops',
    permission: Permissions.REGULAR,

    whitelisted_channels: ['stackupdotorg'],
    whitelisted_users: ['finncapp', 'itsjusttriz'],

    run: async (opts) => {
        const m = [
            "If you haven't yet please make sure to connect your twitch to your " +
                'MC account by using the command /twitch (twitch name) which will allow you to get drops on the server.',

            'You can then use the /online command to see what streamers are on the server and live. ' +
                'It will give you a direct link to their channels to click.',
        ];

        for (const line of m) {
            await opts.chatClient.say(opts.channel, line);
            await ITime.wait(2000);
        }
        return;
    },
} as Command;
