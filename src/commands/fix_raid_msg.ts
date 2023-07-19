import { IjtApi } from "../services/ijt.api.service";
import { LogPrefixes, logger as _logger } from "../utils/Logger";
import { Permissions } from "../utils/constants";
import { Command } from "../utils/interfaces";

/**
* 
* This command is stritcly used for the StackUpDotOrg channel for when Finncapp is live on the ChromaCage MC server.
*/

export const command = {
    name: 'fixraidmsg',
    permission: Permissions.REGULAR,
    requiresInput: false,

    whitelisted_channels: ['finncapp', 'itsjusttriz'],
    whitelisted_users: ['finncapp', 'itsjusttriz'],

    run: async opts => {
        const logger = _logger.setPrefix(LogPrefixes.SERVICES_IJT_API);

        const isNightbotAvailable: Boolean = await IjtApi.isNightbotAvailable();
        if (!isNightbotAvailable) {
            logger.error('Error: Nightbot Multiline script not available.');
        }

        await opts.chatClient.say(opts.channel, `!editcom !raidmsg -a=!${isNightbotAvailable ? 'ijt_raidmsg_api' : 'temporaryraidmessage'}`);
        return;
    }
} as Command;