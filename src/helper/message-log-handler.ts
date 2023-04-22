import { ChatUserstate } from "tmi.js";
import { MessageOptions } from "../utils/MessageOptions";
import { colors } from "../utils/logger";
import { isCasterOrAbove, isModOrAbove, isSubOrAbove, isVip } from "../utils/check-command-permissions";

export const parseUserType = async (tags: ChatUserstate) => {
    let prefixColor = "";

    switch (true) {
        case isCasterOrAbove(tags):
            prefixColor = colors.RED;
            break;
        case isModOrAbove(tags):
            prefixColor = colors.GREEN;
            break;
        case isSubOrAbove(tags):
            prefixColor = colors.PURPLE;
            break;
        case isVip(tags):
            prefixColor = colors.PINK;
            break;
        default:
            prefixColor = colors.RESET;
    }

    return `@${prefixColor}${tags.username}${colors.RESET}`;
}

export const handleMessageLogging = async ({ client, channel, self, tags, msg }: MessageOptions): Promise<string> => {
    const arr = [];

    if (client.settings.debug) {
        arr.push(`${colors.DEBUG}[System/DEBUG]${colors.RESET}`);
    }

    arr.push('[System/Chat]', channel, (self ? 'SELF' : await parseUserType(tags)), msg);

    return new Promise((res, rej) => res(arr.join(' | ')));
}