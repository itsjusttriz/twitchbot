import { ChatUserstate } from 'tmi.js';
import { MessageOptions } from '../../utils/MessageOptions';
import { isCasterOrAbove, isModOrAbove, isOwner, isSubOrAbove, isVip } from '../../utils/check-command-permissions';
import { ANSIColors } from '../../utils/Logger';

export const parseUserType = async (tags: ChatUserstate) => {
    let prefixColor = '';

    switch (true) {
        case isOwner(tags):
            prefixColor = ANSIColors.BLUE;
            break;
        case isCasterOrAbove(tags):
            prefixColor = ANSIColors.RED;
            break;
        case isModOrAbove(tags):
            prefixColor = ANSIColors.GREEN;
            break;
        case isSubOrAbove(tags):
            prefixColor = ANSIColors.PURPLE;
            break;
        case isVip(tags):
            prefixColor = ANSIColors.PINK;
            break;
        default:
            prefixColor = ANSIColors.RESET;
    }

    return `${prefixColor}@${tags.username}${ANSIColors.RESET}`;
};

export const handleMessageLogging = async ({ channel, self, tags, msg }: MessageOptions): Promise<string> => {
    const arr = [channel, self ? 'SELF' : await parseUserType(tags), msg];

    return new Promise((res, rej) => res(arr.join(' | ')));
};
