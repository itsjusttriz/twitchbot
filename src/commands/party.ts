import { dndDb } from '../controllers/DatabaseController/DndDatabaseController';
import { _ } from '../utils';
import { logger } from '../utils/Logger';
import { hasPermission } from '../helper/CommandPermissionCheck';
import { Command } from '../utils/interfaces';

export const command = {
    name: 'party',
    permission: 'REGULAR',
    run: async (opts) => {
        const _list = await dndDb.getParty(opts.dehashedChannel).catch(_.quickCatch);

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

        if (!hasPermission(opts.tags, 'mod')) return;
        const action = opts.args.shift();
        switch (action) {
            case 'create':
                try {
                    await dndDb.createParty(opts.dehashedChannel);
                    await opts.chatClient.say(opts.channel, 'Created party!');
                } catch (error) {
                    logger.db.error(error);
                    await opts.chatClient.say(opts.channel, 'Failed to create a party.');
                }
                break;
            case '+':
            case 'add':
                list.push(...opts.args);
                try {
                    await dndDb.updatePartyMembers(opts.dehashedChannel, [...new Set(list)].join(','));
                    await opts.chatClient.say(opts.channel, 'Updated party!');
                } catch (error) {
                    logger.db.error(error);
                    await opts.chatClient.say(opts.channel, 'Failed to add member(s) to party.');
                }
                break;
            case '-':
            case 'remove':
                const removedResult = list.filter((c: string) => !opts.args.includes(c));
                try {
                    await dndDb.updatePartyMembers(opts.dehashedChannel, [...new Set(removedResult)].join(','));
                    await opts.chatClient.say(opts.channel, 'Updated party!');
                } catch (error) {
                    logger.db.error(error);
                    await opts.chatClient.say(opts.channel, 'Failed to remove member(s) from party.');
                }
                break;
            default: {
                break;
            }
        }
        return;
    },
} as Command;
