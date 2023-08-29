import { _ } from '../utils';
import { logger } from '../utils/Logger';
import { Permissions } from '../utils/constants';
import { Command } from '../utils/interfaces';
import { toggleChannelEvent, updateChannelRaidEventMessage, updateChannelRaidEventTrigger } from '../utils/sqlite';

/**
 * 
        - Store channel name & Id.
        - `message` event will be `toggle-only`.
 */

export const command = {
    name: 'events',
    aliases: [],
    permission: Permissions.CASTER,
    requiresInput: true,
    minArgs: 4,
    min_args_error_message: 'Usage: !events <channel> <action> <eventName> <...value>',
    run: async (opts) => {
        const [_channel, action, eventName, ...extraText] = opts.args;
        const channel = _.dehashChannel(_channel);

        const possibleActions = ['toggle', 'editmsg', 'edittrigger'];
        if (!possibleActions.includes(action.toLowerCase())) {
            await opts.chatClient.say(
                opts.channel,
                `You must declare which action you'd like to perform! (${possibleActions.join(', ')})`
            );
            return;
        }

        let shouldSendResponse = false;

        switch (action.toLowerCase()) {
            case 'toggle': {
                if (!['true', 'false'].includes(extraText[0])) {
                    await opts.chatClient.say(
                        opts.channel,
                        `Invalid argument (${extraText}). This must be true or false!`
                    );
                    return;
                }

                try {
                    const stmt = await toggleChannelEvent(channel, eventName, extraText[0] === 'true').catch((e) => ({
                        changes: 0,
                    }));
                    shouldSendResponse = !!stmt.changes;
                } catch (error) {
                    logger.db.error(error);
                    shouldSendResponse = false;
                }
                break;
            }
            case 'editmsg': {
                if (!extraText.length) {
                    await opts.chatClient.say(
                        opts.channel,
                        'Please declare what you would like the new event message to be!'
                    );
                    return;
                }

                try {
                    const stmt = await updateChannelRaidEventMessage(channel, eventName, extraText.join(' ')).catch(
                        (e) => ({ changes: 0 })
                    );
                    shouldSendResponse = !!stmt.changes;
                } catch (error) {
                    logger.db.error(error);
                    shouldSendResponse = false;
                }
                break;
            }
            case 'edittrigger': {
                if (!extraText.length) {
                    await opts.chatClient.say(
                        opts.channel,
                        "Please declare a 'min. viewers' number to act as the raid event trigger."
                    );
                    return;
                }

                const triggerAmount = parseInt(extraText[0]);
                if (isNaN(triggerAmount)) {
                    await opts.chatClient.say(
                        opts.channel,
                        `Invalid integer (${extraText[0]}). This must be a number.`
                    );
                    return;
                }

                try {
                    const stmt = await updateChannelRaidEventTrigger(
                        channel,
                        eventName,
                        triggerAmount.toString()
                    ).catch((e) => ({ changes: 0 }));
                    shouldSendResponse = !!stmt.changes;
                } catch (error) {
                    logger.db.error(error);
                    shouldSendResponse = false;
                }
                break;
            }
        }

        let response = !shouldSendResponse
            ? `Failed to run action (${action.toLowerCase()}) on event (${eventName}) for channel (${channel}).`
            : `Updated event (${eventName}) for channel (${channel}).`;

        await opts.chatClient.say(opts.channel, response);
        return;
    },
} as Command;
