import { ITime } from "@itsjusttriz/utils";

export enum colors {
    GREEN = '\x1b[1;32m',
    RED = '\x1b[1;31m',
    YELLOW = '\x1b[1;33m',
    PURPLE = '\x1b[1;35m',
    PINK = '\x1b[1;95m',


    RESET = '\x1b[0;0m',
    DEBUG = '\x1b[2;37;41m'
}

export const logger = {
    success: (...input: any[]) => {
        const inputTemp = input.map(line => `${colors.GREEN}${line}${colors.RESET}`);
        console.log(ITime.formatNow('short'), '|', ...inputTemp);
    },
    error: (...input: any[]) => {
        const inputTemp = input.map(line => `${colors.RED}${line}${colors.RESET}`);
        console.log(ITime.formatNow('short'), '|', ...inputTemp);
    },
    info: (...input: any[]) => {
        const inputTemp = input.map(line => `${colors.YELLOW}${line}${colors.RESET}`);
        console.log(ITime.formatNow('short'), '|', ...inputTemp);
    },
    normal: (...input: any[]) => {
        console.log(ITime.formatNow('short'), '|', input.join(' | '));
    }
}