import { MessageOptions } from "../MessageOptions";
import { Permissions } from "../types/permissions-type";

export interface Command {
    name: string;
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