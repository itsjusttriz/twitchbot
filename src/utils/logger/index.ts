import { ITime } from "@itsjusttriz/utils";

export enum colors {
    RESET = '\x1b[0;0m',
    GREEN = '\x1b[1;32m',
    RED = '\x1b[1;31m',
    YELLOW = '\x1b[1;33m',
}

export const logger = {
    success: (...input: any[]) => {
        const inputTemp = input.map(line => `${colors.GREEN}${line}${colors.RESET}`);
        console.log(ITime.formatNow('short'), ' | ', ...inputTemp);
    },
    error: (...input: any[]) => {
        const inputTemp = input.map(line => `${colors.RED}${line}${colors.RESET}`);
        console.log(ITime.formatNow('short'), ' | ', ...inputTemp);
    },
    info: (...input: any[]) => {
        const inputTemp = input.map(line => `${colors.YELLOW}${line}${colors.RESET}`);
        console.log(ITime.formatNow('short'), ' | ', ...inputTemp);
    },
    normal: (...input: any[]) => {
        console.log(ITime.formatNow('short'), '|', input.join(' | '));
    }
}