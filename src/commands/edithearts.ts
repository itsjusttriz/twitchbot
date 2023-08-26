import { dehashChannel } from '../helper/dehash-channels';
import { logger } from '../utils/Logger';
import { Permissions } from '../utils/constants';
import { Command } from '../utils/interfaces';
import { addHeartEmote, removeHeartEmote, toggleHeartEmotesByChannel } from '../utils/sqlite';

export const command = {
    name: 'edithearts',
    aliases: [],
    permission: Permissions.OWNER,
    blacklisted_channels: ['stackupdotorg'],
    run: async (opts) => {
        const [_params, ...value] = opts.args;
        const params = new URLSearchParams(_params);

        const option = params.get('option');
        if (!option) {
            await opts.chatClient.say(opts.channel, "Parameter 'option' is required.");
            return;
        }

        const channel = params.get('channel') || dehashChannel(opts.channel);

        let succeeded = [];
        let failed = [];

        switch (option) {
            case '+':
            case 'add':
                for (const heart of value) {
                    const stmt = await addHeartEmote(channel, heart).catch((e) => {
                        if (!failed.includes(heart)) failed.push(heart);
                        logger.sysDebug.error(e);
                        return;
                    });
                    if (!stmt || !stmt.changes) {
                        if (!failed.includes(heart)) failed.push(heart);
                    } else {
                        if (!succeeded.includes(heart)) succeeded.push(heart);
                    }
                }
                if (succeeded.length)
                    await opts.chatClient.say(
                        opts.channel,
                        `Added hearts (${succeeded.join(' ')}) to channel (${channel}).`
                    );
                if (failed.length)
                    await opts.chatClient.say(
                        opts.channel,
                        `Failed to add hearts (${failed.join(' ')}) to channel (${channel}).`
                    );
                break;

            case '-':
            case 'remove':
                for (const heart of value) {
                    const stmt = await removeHeartEmote(heart).catch((e) => {
                        if (!failed.includes(heart)) failed.push(heart);
                        logger.sysDebug.error(e);
                        return;
                    });
                    if (!stmt || !stmt.changes) {
                        if (!failed.includes(heart)) failed.push(heart);
                    } else {
                        if (!succeeded.includes(heart)) succeeded.push(heart);
                    }
                }
                if (succeeded.length)
                    await opts.chatClient.say(
                        opts.channel,
                        `Removed hearts (${succeeded.join(' ')}) from channel (${channel}).`
                    );
                if (failed.length)
                    await opts.chatClient.say(
                        opts.channel,
                        `Failed to remove hearts (${failed.join(' ')}) from channel (${channel}).`
                    );
                break;

            case 'toggle':
                const stmt = await toggleHeartEmotesByChannel(channel, value[0] === 'true').catch(async (e) => {
                    logger.sysDebug.error(e);
                    return;
                });

                if (!stmt || !stmt.changes)
                    await opts.chatClient.say(opts.channel, `No heart emotes found for this channel (${channel}).`);
                else
                    await opts.chatClient.say(
                        opts.channel,
                        `Toggled all hearts from channel (${channel}) to ${value[0]}.`
                    );
                return;
        }
        return;
    },
} as Command;
