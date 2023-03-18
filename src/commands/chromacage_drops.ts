import { ITime } from "@itsjusttriz/utils";
import { CommandOptions } from "../utils/command-options.js";
import { Permissions } from "../utils/types/permissions-type.js";

export default {
    name: 'drops',
    whitelisted_channels: ['stackupdotorg'],
    permission: Permissions.REGULAR,

    /**
     * 
     * This command is stritcly used for the StackUpDotOrg channel for when Finncapp is live on the ChromaCage MC server.
     */

    run: async (opts: CommandOptions) => {

        if (!['finncapp', 'itsjusttriz'].includes(opts.user))
            return;

        let line1 = '';
        line1 += "If you haven't yet please make sure to connect your twitch to your ";
        line1 += "MC account by using the command /twitch (twitch name) which will allow you to get drops on the server.";

        let line2 = '';
        line2 += "You can then use the /online command to see what streamers are on the server and live. ";
        line2 += "It will give you a direct link to their channels to click.";

        (await opts.getChatClient()).say(opts.channel, line1);
        await ITime.wait(1000 * 2);
        (await opts.getChatClient()).say(opts.channel, line2);

        return;
    }
}