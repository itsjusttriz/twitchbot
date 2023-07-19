import { ITime } from "@itsjusttriz/utils";
import { Permissions } from "../utils/constants";
import { Command } from "../utils/interfaces";

export const command = {
    name: 'bot',
    aliases: ['process'],
    permission: Permissions.OWNER,
    run: async opts => {
        const [_params, ..._value] = opts.args;
        const params = new URLSearchParams(_params);

        const subcmd = params.get('subcmd');
        if (!subcmd) {
            await opts.chatClient.say(opts.channel, `${opts.user} -> I'm still here!`);
            return;
        }

        switch (subcmd) {
            case 'uptime':
                const rawUptime = Math.floor(process.uptime());
                const { string: uptime } = await ITime.getTimeFrom(rawUptime * 1000, true);
                await opts.chatClient.say(opts.channel, `${opts.user} -> My uptime is: ${uptime}`);
                break;
            default: {
                await opts.chatClient.say(opts.channel, `Invalid subcmd (${subcmd}) for command (!bot).`);
            }
        }

        return;
    }
} as Command;