import { LogPrefixes, logger } from "../utils/Logger";
import { Permissions } from "../utils/constants";
import { Command } from "../utils/interfaces";
import { getUsableHeartEmotes } from "../utils/sqlite";

export const command = {
    name: 'hearts',
    aliases: [],
    permission: Permissions.MODERATOR,
    run: async opts => {
        const hearts = await getUsableHeartEmotes().catch(e => {
            logger.setPrefix(LogPrefixes.DEBUG_MODE).error(e);
            return;
        });

        if (!hearts || !hearts.length) {
            if (opts.client.settings.debug.isToggled)
                await opts.chatClient.say(opts.channel, "Failed to run db::getUsableHeartEmotes().");
            return;
        }

        const mapped = hearts.map(x => x.emoteName);
        const shuffled = mapped
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
        const stringified = shuffled.join(' ');

        await opts.chatClient.say(opts.channel, stringified);
    }
} as Command;