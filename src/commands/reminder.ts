import { client } from "../controllers/client.controller";
import { dehashChannel } from "../helper/dehash-channels";
import { LogPrefixes, logger as _logger } from "../utils/Logger";
import { Permissions } from "../utils/constants";
import { Command } from "../utils/interfaces";


const logger = _logger.setPrefix(LogPrefixes.DEBUG_MODE);

export const command = {
    name: 'reminder',
    aliases: [],
    permission: Permissions.MODERATOR,
    requiresInput: true,
    run: async opts => {
        const channel = dehashChannel(opts.channel);
        const hook = opts.client.discordWebhooks?.get(channel);
        if (!hook) {
            logger.error(`No webhook found for channel (channel)`);
            return;
        }

        await hook.send({
            username: `Twitch Reminder - @${opts.user}`,
            content: `${opts.msgText}`
        }).then(async msg => {
            if (!msg.id) {
                logger.error(`No msgId for DiscordWebookRequest under Client (${hook.id})`);
                return;
            }
            logger.success(`Sent Reminder to channel (${msg.channel_id})`);
            await opts.chatClient.say(opts.channel, 'Reminder sent!')
        }).catch(async err => {
            logger.error(err);
            await opts.chatClient.say(opts.channel, 'Failed to send reminder! Quick, get help! Kappa');
        });
        return;
    }
} as Command;