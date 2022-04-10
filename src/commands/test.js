import { CommandOptions } from "../utils/command-options.js"

export default {
    name: 'test',
    permission: '*',
    /**
     * 
     * @param {CommandOptions} opts 
     */
    run: (opts) =>
    {
        opts.client.say(opts.channel, 'Test failed Kappa')
    }
}