import { MessageOptions } from "../utils/MessageOptions";

export const handleMessageLogging = async ({ client, channel, self, tags, msg }: MessageOptions): Promise<string> => {
    const arr = [];

    if (client.settings.debug) {
        arr.push('[System/DEBUG]');
    }

    arr.push(channel, (self ? 'SELF' : `@${tags.username}`), msg);

    return new Promise((res, rej) => res(arr.join(' | ')));
}