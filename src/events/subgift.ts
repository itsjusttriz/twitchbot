import { SubGiftUserstate, SubMethods } from "tmi.js";
import { LogPrefixes, logger as _logger } from "../utils/Logger";
import { Event } from "../utils/interfaces/Event";
import { ClientController } from "../controllers/client.controller";

const logger = _logger.setPrefix(LogPrefixes.DEBUG_MODE);

const handleSelfSubs = async (client: typeof ClientController, recipient: string, methods: SubMethods, username: string, channel: string) => {
    if (recipient.toLowerCase() !== 'ijtdev') {
        logger.error('Failed! Recipient is: ' + recipient)
        return;
    }
    const hook = client.discordWebhooks.get(recipient);
    if (!hook) {
        logger.error("Couldnt retrieve DiscordWebhook for logging inside event::subgift");
        return;
    }
    const plan = methods.plan !== "Prime"
        ? (parseInt(methods.plan) / 1000).toString()
        : "Prime";

    console.log({ username, recipient, channel, plan, hook })
    const m = await hook.send({
        username: "Twitch SubGifts",
        content: `<@!228167686293553164> - A Giftsub (Tier ${plan}) was received from "${username}" on "${channel}". Dont forget to enable the !hearts emoteset for this channel!`
    }).catch(err => {
        logger.error(err);
        return;
    });

    if (m && m?.id) {
        logger.success("Sent GiftSub info to Discord.");
    }
    return;
}

export const event = {
    name: 'subgift',
    once: false,
    run: async (client, channel: string, username: string, streakMonths: number, recipient: string, methods: SubMethods, userstate: SubGiftUserstate) => {
        await handleSelfSubs(client, recipient, methods, username, channel).catch(e => {
            logger.error(e);
        });
        return;
    }
} as Event; 