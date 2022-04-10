import { CommandOptions } from "../utils/command-options.js"

export default {
    name: 'echo',
    permission: 'owner',
    /**
     * 
     * @param {CommandOptions} opts 
     */
    run: (opts) =>
    {
        if (!opts.msgText)
            return;
        opts.client.say(opts.channel, opts.msgText)
    }
}