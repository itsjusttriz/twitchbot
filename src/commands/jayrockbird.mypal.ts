import { palworldDb } from '../controllers/DatabaseController/PalwordNamesDatabaseController';
import { hasPermission } from '../helper/CommandPermissionCheck';
import { createUUID } from '../helper/CreateUUID';
import { _ } from '../utils';
import { logger } from '../utils/Logger';
import { Command } from '../utils/interfaces';

// Intended for use in #jayrockbird but CAN open to other channel's as sql table is prepared.

const USAGE = `Usage: !mypal OR !mypal set {palName}`;

export const command = {
    name: 'mypal',
    aliases: ['pickpal'],
    permission: 'REGULAR',
    maxArgs: 2,
    maxArgsErrorMessage: USAGE,
    whitelisted_channels: ['jayrockbird'],
    run: async (opts) => {
        try {
            const [action, input] = opts.args;

            const pal = await palworldDb
                .getPalForUserByChannel(opts.dehashedChannel, opts.user.toLowerCase())
                .catch(_.quickCatch);

            if (!opts.args.length || !['set', 'reset', 'view'].includes(action.toLowerCase())) {
                // Return the palName for this user in this channel.
                if (!pal) {
                    throw `Failed to get your PalworldObject. Are you sure you have one? `;
                }

                logger.sysDebug.info('Fetched PalworldObject with id: ' + pal.id);
                await opts.chatClient.say(opts.channel, `You have previously named: ` + pal.palName);
                return;
            }

            switch (action.toLowerCase()) {
                case 'set': {
                    if (!!pal && !!pal.id) {
                        throw `You have already named a pal: ${pal.palName}. A moderator can reset this choice, if they choose to, using "!mypal reset {username}" :D`;
                    }

                    const id = createUUID(10);
                    const stored = await palworldDb
                        .setPalForUserInChannel(id, opts.dehashedChannel, opts.user.toLowerCase(), input.toLowerCase())
                        .catch(_.quickCatch);
                    if (!stored) {
                        throw `Failed to store your chosen pal to the database. Try again later.`;
                    }

                    if (!stored.changes) {
                        throw `Nothing happened.`;
                    }

                    logger.db.success(`Stored new PalworldObject with id: ` + id);
                    await opts.chatClient.say(
                        opts.channel,
                        `${opts.user.toLowerCase()} has chosen to name a ${input} after themselves.`
                    );
                    break;
                }
                case 'reset': {
                    if (!hasPermission(opts.tags, 'mod')) {
                        return;
                    }

                    const targetPal = await palworldDb
                        .getPalForUserByChannel(opts.dehashedChannel, input.toLowerCase())
                        .catch(_.quickCatch);
                    if (!targetPal) {
                        throw `Failed to get a PalworldObject for this user. They may not have one set.`;
                    }

                    const removed = await palworldDb
                        .resetPalForUserInChannelAsAdmin(opts.dehashedChannel, input.toLowerCase())
                        .catch(_.quickCatch);
                    if (!removed) {
                        throw `Failed to remove this user's PalworldObject from the database. Try again later.`;
                    }

                    if (!removed.changes) {
                        throw `Nothing happened.`;
                    }

                    logger.db.success(`Removed PalworldObject with id: ` + targetPal.id);
                    await opts.chatClient.say(opts.channel, `Successfully deleted this user's PalworldObject!`);
                    break;
                }
                case 'view': {
                    if (!hasPermission(opts.tags, 'mod')) {
                        return;
                    }

                    const targetPal = await palworldDb
                        .getPalForUserByChannel(opts.dehashedChannel, input.toLowerCase())
                        .catch(_.quickCatch);
                    if (!targetPal) {
                        throw `Failed to get a PalworldObject for this user. They may not have one set.`;
                    }

                    logger.sysDebug.info('Fetched PalworldObject with id: ' + targetPal.id);
                    await opts.chatClient.say(
                        opts.channel,
                        `${targetPal.username} has chosen to name: ` + targetPal.palName
                    );
                }
            }
        } catch (error) {
            logger.sysDebug.error(error);
            await opts.chatClient.say(opts.channel, error);
        }
        return;
    },
} as Command;
