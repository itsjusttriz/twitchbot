import { raidEventDb } from '../controllers/DatabaseController/ChannelRaidDatabaseController';
import { _ } from '../utils';
import { logger } from '../utils/Logger';
import { Command } from '../utils/interfaces';

/**
    {
        channel: string;
        condition: number;
        disabled: 0 | 1;
        loggable: 0 | 1;
        outcome: string;
    }
 * !raids <channel> condition <number>
 * !raids <channel> disabled <boolean>
 * !raids <channel> loggable <boolean>
 * !raids <channel> outcome <string[]>
 */

export const command = {
    name: 'raidevents',
    aliases: ['raids'],
    permission: 'CASTER',
    requiresInput: true,
    minArgs: 3,
    min_args_error_message: 'Usage: !raidevent <channel> <field> <...value>',
    run: async (opts) => {
        try {
            const [channel, field, ...extraText] = opts.args as [string, string, ...string[]];

            const editableFields = ['condition', 'disabled', 'loggable', 'outcome'];
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

                    const query = await raidEventDb
                        .toggleRaidOutcome(_.dehashChannel(channel), extraText[0] === 'true')
                        .catch(_.quickCatch);
                    if (!query || !query.changes) {
                        throw 'Failed to toggle this raid event outcome.';
                    }
                    break;
                }
                case 'condition': {
                    if (isNaN(+extraText[0])) {
                        throw `Invalid value: ${extraText[0]} - This must be a valid integer.`;
                    }

                    const query = await raidEventDb
                        .updateOutcomeCondition(_.dehashChannel(channel), +extraText[0])
                        .catch(_.quickCatch);
                    if (!query || !query.changes) {
                        throw 'Failed to update the condition for this raid event outcome.';
                    }
                    break;
                }
                case 'loggable': {
                    if (!['true', 'false'].includes(extraText[0])) {
                        throw `Invalid value: ${extraText[0]} - This must be 'true' or 'false'.`;
                    }

                    const query = await raidEventDb
                        .toggleLogging(_.dehashChannel(channel), extraText[0] === 'false')
                        .catch(_.quickCatch);
                    if (!query || !query.changes) {
                        throw 'Failed to toggle logging for this raid event.';
                    }
                    break;
                }
                case 'outcome': {
                    const query = await raidEventDb
                        .updateOutcomeMessage(_.dehashChannel(channel), extraText.join(' '))
                        .catch(_.quickCatch);
                    if (!query || !query.changes) {
                        throw 'Failed to set an outcome for this raid event.';
                    }
                    break;
                }
            }
            await opts.chatClient.say(opts.channel, `Modified field (${field.toLowerCase()}) for this raid event.`);
        } catch (error) {
            logger.sysDebug.error(error);
            await opts.chatClient.say(opts.channel, error);
        }
    },
} as Command;
