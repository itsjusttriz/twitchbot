import { EmbedBuilder } from 'discord.js';
import { SubGiftUserstate, SubMethods } from 'tmi.js';
import { ClientController } from '../controllers/client.controller';
import { logger } from '../utils/Logger';
import { Event } from '../utils/interfaces/Event';

const handleSelfSubs = async (
    client: typeof ClientController,
    recipient: string,
    methods: SubMethods,
    username: string,
    channel: string
) => {
    if (recipient.toLowerCase() !== 'ijtdev') {
        logger.sysDebug.error('Failed! Recipient is: ' + recipient);
        return;
    }
    const hook = client.discordWebhooks.get(recipient);
    if (!hook) {
        logger.sysDebug.error('Couldnt retrieve DiscordWebhook for logging inside event (SubGift)');
        return;
    }

    const plan = methods.plan !== 'Prime' ? (parseInt(methods.plan) / 1000).toString() : 'Prime';

    const embed = new EmbedBuilder()
        .setTitle(`Twitch Channel Point Redemption Event - ${channel}`)
        .setDescription(
            `<@!228167686293553164> - A Giftsub (Tier ${plan}) was received from "${username}" on "${channel}". Dont forget to enable the !hearts emoteset for this channel!`
        );

    try {
        await hook.send({ username: 'TwitchBot Log', embeds: [embed] });
        logger.sysDebug.success('Sent GiftSub info to Discord.');
    } catch (error) {
        logger.sysDebug.error(error);
    }
    return;
};

export const event = {
    name: 'subgift',
    once: false,
    run: async (
        client,
        channel: string,
        username: string,
        streakMonths: number,
        recipient: string,
        methods: SubMethods,
        userstate: SubGiftUserstate
    ) => {
        try {
            await handleSelfSubs(client, recipient, methods, username, channel);
        } catch (error) {
            logger.sysDebug.error(error);
        }
        return;
    },
} as Event;
