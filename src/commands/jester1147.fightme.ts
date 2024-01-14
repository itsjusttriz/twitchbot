import { Command } from '../utils/interfaces';
import { IArray } from '@itsjusttriz/utils';

export const command = {
    name: 'fightme',
    aliases: [],
    permission: 'REGULAR',
    whitelisted_channels: ['ijtdev', 'jester1147'],
    run: async (opts) => {
        const replies = new IArray([
            'Wanna put a bet on it?',
            'Come and get some!',
            'COME ON, THEN!',
            "We both know, i'll win ;)",
            "Aight, let's go...",
            'KAPOW! Knock out time!',
        ]);

        const chosenReply = replies.getRandom();
        await opts.chatClient.say(opts.channel, `@${opts.user} -> ${chosenReply}`);
        return;
    },
} as Command;
