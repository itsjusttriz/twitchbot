import { ijtapiService } from '../services/IjtApiService';
import { logger } from '../utils/Logger';
import { Command } from '../utils/interfaces';

/**
 *
 * This command is stritcly used for the StackUpDotOrg channel for when Finncapp is live on the ChromaCage MC server.
 */

export const command = {
    name: 'fixraidmsg',
    permission: 'REGULAR',
    requiresInput: false,

    whitelisted_channels: ['finncapp', 'itsjusttriz'],
    whitelisted_users: ['finncapp', 'itsjusttriz'],

    run: async (opts) => {
        const isTrue: Boolean = await ijtapiService.checkNightbotStatus();
        if (!isTrue) {
            logger.svcIjtApi.error('Nightbot Multiline script not available.');
        }

        await opts.chatClient.say(
            opts.channel,
            `!editcom !raidmsg -a=!${isTrue ? 'ijt_raidmsg_api' : 'temporaryraidmessage'}`
        );
        return;
    },
} as Command;
