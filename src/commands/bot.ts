import { ITime } from '@itsjusttriz/utils';
import { Command } from '../utils/interfaces';

export const command = {
    name: 'bot',
    aliases: ['process'],
    permission: 'OWNER',
    isUnmutable: true,
    run: async (opts) => {
        const subcmd = opts.args[0];
        if (!subcmd) {
            await opts.chatClient.say(opts.channel, `${opts.user} -> I'm still here!`);
            return;
        }

        switch (subcmd) {
            case 'uptime': {
                const rawUptime = Math.floor(process.uptime());
                const { string: uptime } = await ITime.getTimeFrom(rawUptime * 1000, true);
                await opts.chatClient.say(opts.channel, `${opts.user} -> My uptime is: ${uptime}`);
                break;
            }
            case 'mute': {
                const hasProperty = opts.client.settings.hasOwnProperty('isMuted');
                const prev = hasProperty ? opts.client.settings['isMuted'] : false;

                if (!hasProperty) {
                    await opts.chatClient.say(
                        opts.channel,
                        "Cannot configure this property. Please update the system's config file."
                    );
                    return;
                }

                opts.client.settings.isMuted = !prev;
                await opts.chatClient.say(opts.channel, `${opts.user} -> Toggled 'isMuted' setting to ${!prev}`);
                break;
            }
            default: {
                await opts.chatClient.say(opts.channel, `Invalid subcmd (${subcmd}) for command (!bot).`);
            }
        }

        return;
    },
} as Command;
