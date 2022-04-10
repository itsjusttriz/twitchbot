import { CommandOptions } from "../utils/command-options.js"

export default {
    name: 'join',
    permission: 'owner',
    /**
     * 
     * @param {CommandOptions} opts 
     */
    run: (opts) =>
    {
        if (!opts.msgText)
            return;

        try
        {
            opts.client.join(opts.args[0]).then(c =>
            {
                opts.client.say(opts.channel, 'Joined ' + c)
            })
        } catch (e)
        {
            console.log('Failed to join channel:', opts.args[0]);
            opts.client.say(opts.channel, 'Failed to join channel: ' + opts.args[0])
        }
    }
}

// TODO: Setup channel tracking/storing in mongo