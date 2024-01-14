import { BasicObjectProps } from '@itsjusttriz/utils';
import { logger } from './Logger';

export const _ = {
    dehashChannel(c: string) {
        return c.replaceAll('#', '');
    },
    unmentionUser(u: string) {
        return u.replaceAll('@', '');
    },
    quickCatch(e: any) {
        logger.sysDebug.error(e);
        return;
    },
    isStringABoolean(s: string) {
        return ['true', 'false'].includes(s.toLowerCase());
    },
    parseCustomVarsInMessage(message: string, props: BasicObjectProps): Promise<string> {
        const replaceables = new Map<string, any>();

        replaceables.set('{channel}', _.dehashChannel(props.channel));
        replaceables.set('{username}', props.username);
        replaceables.set('{viewercount}', props.viewers);

        return new Promise((res, rej) =>
            res(
                message
                    .split(' ')
                    .map((word) => (!replaceables.has(word) ? word : replaceables.get(word).toString()))
                    .join(' ')
            )
        );
    },
};
