import { heartsDb } from '../controllers/DatabaseController/HeartEmotesDatabaseController';
import { _ } from '../utils';
import { logger } from '../utils/Logger';
import { Command } from '../utils/interfaces';

export const command = {
    name: 'hearts',
    aliases: [],
    permission: 'MODERATOR',
    run: async (opts) => {
        try {
            const hearts = await heartsDb.getEnabledHeartEmotes().catch(_.quickCatch);
            if (!hearts || !hearts.length) {
                throw 'Failed to get usable heart emotes.';
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
        } catch (error) {
            logger.sysDebug.error(error);
            await opts.chatClient.say(opts.channel, error);
        }
    },
} as Command;
