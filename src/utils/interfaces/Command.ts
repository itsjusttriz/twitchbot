import { MessageOptions } from '../MessageOptions';
import { Permissions } from '../constants';

export interface Command {
    name: string;
    aliases?: string[];
    permission: keyof typeof Permissions;

    isUnmutable?: boolean;
    isDisabled?: boolean;

    requiresInput?: boolean;

    minArgs?: number;
    min_args_error_message?: string;

    maxArgs?: number;
    max_args_error_message?: string;

    whitelisted_channels?: string[];
    blacklisted_channels?: string[];

    whitelisted_users?: string[];
    blacklisted_users?: string[];

    run: (opts: MessageOptions) => void;
}
