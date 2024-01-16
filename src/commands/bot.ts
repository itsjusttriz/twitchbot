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
                const prev = opts.client.config.IS_MUTED ?? false;

                opts.client.config.IS_MUTED = !prev;
                await opts.chatClient.say(opts.channel, `${opts.user} -> Toggled 'IS_MUTED' setting to ${!prev}`);
                break;
            }
            case 'debug': {
                const prev = opts.client.config.DEBUG_MODE;

                opts.client.config.DEBUG_MODE = !prev;
                await opts.chatClient.say(opts.channel, `${opts.user} -> Toggled 'DEBUG_MODE' setting to ${!prev}`);
                break;
            }
            default: {
                await opts.chatClient.say(opts.channel, `Invalid subcmd (${subcmd}) for command (!bot).`);
            }
        }

        return;
    },
} as Command;
