import { DatabaseControllerBase } from './DatabaseControllerBase';

class HeartEmotesDatabaseController extends DatabaseControllerBase {
    constructor() {
        super('twitch_heart_emotes');
    }

    async getEnabledHeartEmotes() {
        const query = await this._queryDb(
            `SELECT emoteName FROM ${this.tableName} 
            WHERE disabled = 0`
        );
        return query.all();
    }

    async addEmote($channel: string, $emoteName: string) {
        const query = await this._queryDb(
            `INSERT OR REPLACE
            INTO ${this.tableName} (channel, emoteName, disabled)
            VALUES ($channel, $emoteName, 0)`
        );
        return query.run({ $channel, $emoteName });
    }

    async removeEmote($emoteName: string) {
        const query = await this._queryDb(
            `DELETE FROM ${this.tableName}
            WHERE emoteName = $emoteName`
        );
        return query.run({ $emoteName });
    }

    async toggleChannelEmotes($channel: string, $enabled: boolean) {
        const query = await this._queryDb(
            `UPDATE ${this.tableName}
            SET disabled = $disabled
            WHERE channel = $channel`
        );
        return query.run({ $channel, $disabled: !$enabled ? 1 : 0 });
    }
}

export const heartsDb = new HeartEmotesDatabaseController();
