import { Permissions } from "../utils/enums/permissions-type.js";
import { mathApi } from "../services/decapi/math.js";
import { Command } from "../utils/interfaces/Command.js";
import { logger } from "../utils/logger/index.js";

export const command = {
    name: 'calc',
    aliases: ['math'],
    permission: Permissions.MODERATOR,
    requiresInput: true,
    maxArgs: 1,
    maxArgsErrorMessage: 'Calculations must not be space-seperated. eg. 2+2 instead of 2 + 2',
    blacklisted_channels: ['stackupdotorg'],
    run: async opts => {
        await mathApi(opts.args[0]).then(async res => {
            opts.chatClient.say(opts.channel, res)
        }).catch(e => {
            logger.error('[Services/Decapi] Failed to run mathApi():', e);
        });
        return;
    }
} as Command;