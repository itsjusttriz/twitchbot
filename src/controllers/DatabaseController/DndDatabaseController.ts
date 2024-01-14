import { DatabaseControllerBase } from './DatabaseControllerBase';

class DndDatabaseController extends DatabaseControllerBase {
    constructor() {
        super('twitch_channel_dnd_parties');
    }

    async createParty($channel: string) {
        const query = await this._queryDb(
            `INSERT OR IGNORE
            INTO ${this.tableName} (channel, members)
            VALUES ($channel, NULL)`
        );
        return query.run({ $channel });
    }

    async getParty($channel: string) {
        const query = await this._queryDb(
            `SELECT * from ${this.tableName}
            WHERE channel = $channel`
        );
        return query.get({ $channel });
    }

    async updatePartyMembers($channel: string, $members: string) {
        const query = await this._queryDb(
            `UPDATE ${this.tableName}
            SET members = $members 
            WHERE channel = $channel`
        );
        return query.run({ $channel, $members });
    }
}

export const dndDb = new DndDatabaseController();
