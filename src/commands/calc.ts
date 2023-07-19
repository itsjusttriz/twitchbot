import { DecApi } from "../services/decapi.service";
import { LogPrefixes, logger as _logger } from "../utils/Logger";
import { Permissions } from "../utils/constants";
import { Command } from "../utils/interfaces";

export const command = {
    name: 'calc',
    aliases: ['math'],
    permission: Permissions.MODERATOR,
    requiresInput: true,
    maxArgs: 1,
    maxArgsErrorMessage: 'Calculations must not be space-seperated. eg. 2+2 instead of 2 + 2',
    blacklisted_channels: ['stackupdotorg'],
    run: async opts => {
        const logger = _logger.setPrefix(LogPrefixes.SERVICES_DECAPI);

        await DecApi.doMath(opts.args[0]).then(async res => {
            await opts.chatClient.say(opts.channel, res)
        }).catch(e => {
            logger.error(`Failed to run !calc: ${e}`)
        });
        return;
    }
} as Command;