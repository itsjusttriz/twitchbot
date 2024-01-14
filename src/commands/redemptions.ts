import { cpRedemptionsDb } from '../controllers/DatabaseController/ChannelPointsRedemptionsDatabaseController';
import { _ } from '../utils';
import { logger } from '../utils/Logger';
import { Command } from '../utils/interfaces';
/**
 * { 
        id: string,
        title: string,
        channel: string,
        loggable: boolean,
        disabled: boolean,
        outcome: string
    }
 * !redemptions <id> title <string>
 * !redemptions <id> loggable <boolean>
 * !redemptions <id> outcome <string[]>
 * !redemptions <id> disabled <boolean>
 */

export const command = {
    name: 'redemptions',
    aliases: ['cprewards'],
    permission: 'OWNER',
    requiresInput: true,
    minArgs: 3,
    min_args_error_message: 'Usage: !redemptions <id> <field> <...value>',
    run: async (opts) => {
        try {
            const [id, field, ...extraText] = opts.args;

            const editableFields = ['title', 'loggable', 'outcome', 'disabled'];
            if (!editableFields.includes(field.toLowerCase())) {
                await opts.chatClient.say(
                    opts.channel,
                    `You must declare which field you'd like to edit! (${editableFields.join(', ')})`
                );
                return;
            }

            switch (field.toLowerCase()) {
                case 'disabled': {
                    if (!['true', 'false'].includes(extraText[0])) {
                        throw `Invalid value: ${extraText[0]} - This must be 'true' or 'false'.`;
                    }

                    const query = await cpRedemptionsDb
                        .toggleOutcomeMessage(id, extraText[0] === 'true')
                        .catch(_.quickCatch);
                    if (!query || !query.changes) {
                        throw 'Failed to toggle this redemption.';
                    }
                    break;
                }
                case 'title': {
                    const query = await cpRedemptionsDb.setTitle(id, extraText.join(' ')).catch(_.quickCatch);
                    if (!query || !query.changes) {
                        throw 'Failed to set a title for this redemption.';
                    }
                    break;
                }
                case 'loggable': {
                    if (!['true', 'false'].includes(extraText[0])) {
                        throw `Invalid value: ${extraText[0]} - This must be 'true' or 'false'.`;
                    }

                    const query = await cpRedemptionsDb.toggleLogging(id, extraText[0] === 'false').catch(_.quickCatch);
                    if (!query || !query.changes) {
                        throw 'Failed to toggle logging for this redemption.';
                    }
                    break;
                }
                case 'outcome': {
                    const query = await cpRedemptionsDb.setOutputMessage(id, extraText.join(' ')).catch(_.quickCatch);
                    if (!query || !query.changes) {
                        throw 'Failed to set an outcome for this redemption.';
                    }
                    break;
                }
            }
            await opts.chatClient.say(opts.channel, `Modified field (${field.toLowerCase()}) for this redemption.`);
        } catch (error) {
            logger.sysDebug.error(error);
            await opts.chatClient.say(opts.channel, error);
        }
    },
} as Command;
