import { Permissions } from "../utils/enums/permissions-type.js";
import { Command } from "../utils/interfaces/Command.js";
import { isNightbotMultilineAvailable } from "../services/ijt-api/ping-multiline.js";
import { logger } from "../utils/logger/index.js";

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
        const bool: Boolean = await isNightbotMultilineAvailable();
        if (!bool) {
            logger.error('[Services/ijt-api] Error: Nightbot Multiline script not available.');
        }

        opts.chatClient.say(opts.channel, `!editcom !raidmsg -a=!${bool ? 'ijt_raidmsg_api' : 'temporaryraidmessage'}`);
        return;
    }
} as Command;