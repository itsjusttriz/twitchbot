import { DatabaseControllerBase } from './DatabaseControllerBase';

class ChannelConnectionDatabaseController extends DatabaseControllerBase {
    constructor() {
        super('connected_channels');
    }

    async getJoinableChannels() {
        const query = await this._queryDb(
            `SELECT name FROM ${this.tableName}
            WHERE blacklisted = 0`
        );
        return query.all();
    }

    async storeChannel($channel: string) {
        const query = await this._queryDb(
            `INSERT OR IGNORE
            INTO ${this.tableName} (name, blacklisted)
            VALUES ($channel, 0)`
        );
        return query.run({ $channel });
    }

    async updateBlacklist($channel: string, $enabled: boolean) {
        const query = await this._queryDb(
            `UPDATE ${this.tableName}
            SET blacklisted = $blacklisted
            WHERE name = $channel`
        );
        return query.run({ $channel, $blacklisted: !$enabled ? 0 : 1 });
    }
}

export const channelsDb = new ChannelConnectionDatabaseController();
