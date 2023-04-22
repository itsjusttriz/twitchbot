import { MessageOptions } from "../MessageOptions";
import { Permissions } from "../enums/permissions-type";

export interface Command {
    name: string;
    aliases?: string[];
    permission: Permissions;
    isDisabled?: boolean;

    requiresInput?: boolean;

    maxArgs?: number;
    maxArgsErrorMessage?: string;

    whitelisted_channels?: string[];
    blacklisted_channels?: string[];

    whitelisted_users?: string[];
    blacklisted_users?: string[];

    run: (opts: MessageOptions) => void;
}