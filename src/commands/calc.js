import { CommandOptions } from "../utils/command-options.js";
import fetch from 'node-fetch';

// if (!args[0])
//     return client.say(channel, 'No calculation detected. Try again!');

// if (args.length >= 2)
//     return client.say(channel, 'Calculations must not be space-seperated. ex: 2+2 instead of 2 + 2');

// await fetch(`https://decapi.me/math/?exp=${encodeURIComponent(args[0])}`)
//     .then(resp => resp.text())
//     .then(result => chatResponse = result);
// break;

export default {
    name: 'calc',
    permission: 'mod',

    /**
     * 
     * @param {CommandOptions} opts 
     */
    run: (opts) =>
    {
        if (!opts.msgText)
            return;
        if (opts.args.length > 1)
            return opts.client.say(opts.channel, 'Calculations must not be space-seperated. eg. 2+2 instead of 2 + 2');

        fetch(`https://decapi.me/math/?exp=${encodeURIComponent(opts.args[0])}`)
            .then(resp => resp.text())
            .then(res => opts.client.say(opts.channel, res));
    }
}