import { CommandOptions } from "../utils/command-options.js"

export default {
    name: 'leave',
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
            opts.client.part(opts.args[0]).then(c =>
            {
                opts.client.say(opts.channel, 'Left ' + c)
            })
        } catch (e)
        {
            console.log('Failed to leave channel:', opts.args[0]);
            opts.client.say(opts.channel, 'Failed to leave channel: ' + opts.args[0])
        }
    }
}

// TODO: Setup channel tracking/storing in mongo