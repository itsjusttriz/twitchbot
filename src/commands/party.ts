import { logger } from '../utils/Logger';
import { hasPermission } from '../utils/check-command-permissions';
import { Permissions } from '../utils/constants';
import { Command } from '../utils/interfaces';
import { getDungeonParty, updateDungeonMembers } from '../utils/sqlite';

export const command = {
    name: 'party',
    permission: Permissions.REGULAR,
    run: async (opts) => {
        const _list = await getDungeonParty(opts.dehashedChannel).catch((error) => {
            logger.db.error(error);
            return;
        });

        const list = _list?.members?.split(',').filter((x) => !!x.length) || [];

        if (!opts.args.length) {
            const unique = new Set(list);
            if (![...unique].length) return;
            await opts.chatClient.say(opts.channel, `Check out ${opts.dehashedChannel}'s fellow adventurers, here:`);
            for (const chan of [...unique]) {
                let [_name, _channel] = (chan as string).split('|');
                const shoutout = `${_name} -> https://twitch.tv/${!_channel ? _name : _channel}`;
                await opts.chatClient.say(opts.channel, shoutout);
            }
            return;
        }

        if (!hasPermission(opts.tags, 'MODERATOR')) return;
        const action = opts.args.shift();
        switch (action) {
            case '+':
            case 'add':
                list.push(...opts.args);
                try {
                    await updateDungeonMembers(opts.dehashedChannel, [...new Set(list)].join(','));
                    await opts.chatClient.say(opts.channel, 'Updated party!');
                } catch (error) {
                    logger.db.error(error);
                    await opts.chatClient.say(opts.channel, 'Failed to add to party. An error was recorded.');
                }
                break;
            case '-':
            case 'remove':
                const removedResult = list.filter((c: string) => !opts.args.includes(c));
                try {
                    await updateDungeonMembers(opts.dehashedChannel, [...new Set(removedResult)].join(','));
                    await opts.chatClient.say(opts.channel, 'Updated party!');
                } catch (error) {
                    logger.db.error(error);
                    await opts.chatClient.say(opts.channel, 'Failed to remove from party. An error was recorded.');
                }
                break;
            default: {
                break;
            }
        }
        return;
    },
} as Command;
