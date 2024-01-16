import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

class ClientConfigController {
    TWITCH_CLIENT_ID: string;
    TWITCH_CLIENT_SECRET: string;

    COMMAND_PREFIX: string;

    DEBUG_MODE: boolean;
    DEBUG_CHANNEL: string;

    DEFAULT_CHANNELS: string[];

    IS_MUTED: boolean;

    constructor() {
        this.TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID ?? '';
        this.TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET ?? '';

        this.COMMAND_PREFIX = process.env.COMMAND_PREFIX ?? '';

        if (process.env.DEBUG_MODE && !['true', 'false'].includes(process.env.DEBUG_MODE)) {
            throw new Error("Invalid Environment value for DEBUG_MODE. Must be 'true' or 'false'.");
        }
        this.DEBUG_MODE = process.env.DEBUG_MODE === 'true' ?? false;
        this.DEBUG_CHANNEL = process.env.DEBUG_CHANNEL ?? '';

        this.DEFAULT_CHANNELS = process.env.DEFAULT_CHANNELS?.split(',') ?? [];

        this.IS_MUTED = false;
    }
}

export const config = new ClientConfigController();
