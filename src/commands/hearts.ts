import { logger } from '../utils/Logger';
import { Permissions } from '../utils/constants';
import { Command } from '../utils/interfaces';
import { getUsableHeartEmotes } from '../utils/sqlite';

export const command = {
    name: 'hearts',
    aliases: [],
    permission: Permissions.MODERATOR,
    run: async (opts) => {
        const hearts = await getUsableHeartEmotes().catch((e) => {
            logger.sysDebug.error(e);
            return [];
        });

        if (!hearts.length) {
            if (opts.client.settings.debug.enabled)
                await opts.chatClient.say(opts.channel, 'Failed to run db::getUsableHeartEmotes().');
            return;
        }

        const formattedString = hearts
            // Convert to array of 'emoteName'.
            .map((x) => x.emoteName)
            // Allow for randomising order.
            .map((value) => ({ value, sort: Math.random() }))
            // Sort the array in ascending order using new 'sort' values.
            .sort((a, b) => a.sort - b.sort)
            // Convert back to 'emoteNames' keeping the new order in mind.
            .map(({ value }) => value)
            // Convert from array to space-seperated string.
            .join(' ');

        await opts.chatClient.say(opts.channel, formattedString);
    },
} as Command;
