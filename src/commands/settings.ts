import { _ } from '../utils';
import { logger } from '../utils/Logger';
import { Command } from '../utils/interfaces';

export const command = {
    name: 'toggle',
    aliases: ['config'],
    permission: 'OWNER',
    requiresInput: true,
    maxArgs: 2,
    maxArgsErrorMessage: 'Invalid arguments. Usage: !toggle <option> <true/false>',
    whitelisted_channels: ['itsjusttriz', 'ijtdev'],
    run: async (opts) => {
        let [option, boolVal] = opts.args;

        const isValidOption = opts.client.settings.hasOwnProperty(option);
        if (!isValidOption) {
            await opts.chatClient.say(
                opts.channel,
                'Invalid option. Available options: ' + Object.keys(opts.client.settings)
            );
            return;
        }

        const isValidBoolean = _.isStringABoolean(boolVal);
        if (!isValidBoolean) {
            opts.chatClient.say(opts.channel, 'Invalid value. Must be true/false.');
            return;
        }

        let hasUpdated: boolean = true;

        if (['*'].includes(opts.client.settings[option])) hasUpdated = false;
        else opts.client.settings[option].enabled = boolVal === 'true';

        if (opts.client.settings.debug.enabled)
            logger.sysDebug.info(
                `${hasUpdated ? 'Updated' : 'Failed to Update'} Client Settings: ${JSON.stringify({
                    [option]: opts.client.settings[option],
                })}`
            );

        await opts.chatClient.say(
            opts.channel,
            `Updated setting! Expected Result: { ${option}: ${boolVal} } ~ Achieved Result: { ${option}: ${opts.client.settings[option]} }`
        );
        return;
    },
} as Command;
