import { CommandOptions } from "../utils/command-options.js";

export default {
    name: 'epoch',
    permission: '*',

    /**
     * 
     * @param {CommandOptions} opts 
     */
    run: (opts) =>
    {
        if (!opts.msgText)
            return;

        const regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;
        if (!regex.test(opts.msgText))
            return opts.client.say(opts.channel, 'Invalid Timestamp. Format must be: yyyy-mm-ddT07:00');

        const epoch = new Date(opts.msgText).getTime() / 1000;
        opts.client.say(opts.channel, epoch.toString());
    }
}