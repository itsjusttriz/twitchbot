import { DatabaseControllerBase } from './DatabaseControllerBase';

class DiscordWebhookDatabaseController extends DatabaseControllerBase {
    constructor() {
        super('discord_webhook_urls');
    }

    async getAllWebhooks() {
        const query = await this._queryDb(`SELECT * FROM ${this.tableName}`);
        return query.all();
    }

    async addWebhook($channel: string, $url: string) {
        const query = await this._queryDb(
            `INSERT OR REPLACE
            INTO ${this.tableName} (channel, url)
            VALUES ($channel, $url)`
        );
        return query.run({ $channel, $url });
    }
}

export const discordHooksDb = new DiscordWebhookDatabaseController();
