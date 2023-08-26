import { dehashChannel } from '../helper/dehash-channels';
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
    minArgs: 2,
    min_args_error_message:
        "Usage: `!events <query> [...value?]`. An example 'query' could be: action=toggle&event=raid",
    run: async (opts) => {
        const [_params, ...value] = opts.args;
        const p = new URLSearchParams(_params);
        const action = p.get('action'),
            eventName = p.get('event');

        if (!action) {
            await opts.chatClient.say(opts.channel, "You must declare which action you'd like to perform!");
            return;
        }
        if (!eventName) {
            await opts.chatClient.say(opts.channel, "You must declare which event you'd like to manage!");
            return;
        }
        const channel = p.has('channel') ? p.get('channel') : dehashChannel(opts.channel);

        switch (action.toLowerCase()) {
            case 'toggle':
                {
                    if (!['true', 'false'].includes(value[0])) {
                        await opts.chatClient.say(
                            opts.channel,
                            "The value given for 'action:toggle' is not valid. This must be a Boolean!"
                        );
                        return;
                    }

                    const stmt = await toggleChannelEvent(channel, eventName, value[0] === 'true').catch((e) => {
                        logger.db.error(e);
                        return;
                    });

                    let response =
                        !stmt || !stmt.changes
                            ? `Failed to run action (toggle) on event (${eventName}) for channel (${channel}).`
                            : `Toggled event (${eventName}) for channel (${channel}) to ${value[0]}`;

                    await opts.chatClient.say(opts.channel, response);
                }
                break;
            case 'edit':
                {
                    const option = p.get('option');
                    if (!option || !['trigger', 'message'].includes(option)) {
                        await opts.chatClient.say(
                            opts.channel,
                            "You must declare which event option, you'd like to manage."
                        );
                        return;
                    }

                    const input = option === 'trigger' ? value[0] : value.join(' ');
                    const cb = option === 'trigger' ? updateChannelRaidEventTrigger : updateChannelRaidEventMessage;

                    const stmt = await cb(channel, eventName, input).catch((e) => {
                        logger.db.error(e);
                        return;
                    });

                    let response =
                        !stmt || !stmt.changes
                            ? `Failed to run action (edit:${option}) on event (${eventName}) for channel (${channel}).`
                            : `Updated event (${eventName}) for channel (${channel}).`;

                    await opts.chatClient.say(opts.channel, response);
                }
                break;
        }
        return;
    },
} as Command;
