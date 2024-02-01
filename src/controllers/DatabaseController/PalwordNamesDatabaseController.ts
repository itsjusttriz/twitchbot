import { DatabaseControllerBase } from './DatabaseControllerBase';

export type PalworldObject = {
    id: number;
    channel: string;
    username: string;
    palName: string;
};

class PalwordNamesDatabaseController extends DatabaseControllerBase {
    constructor() {
        super('palworld_pal_names');
    }

    async getPalForUserByChannel($channel: string, $username: string) {
        const query = await this._queryDb(
            `SELECT * FROM ${this.tableName}
            WHERE channel = $channel AND username = $username`
        );
        return query.get<PalworldObject>({ $channel, $username });
    }

    async setPalForUserInChannel($id: number, $channel: string, $username: string, $palName: string) {
        const query = await this._queryDb(
            `INSERT INTO 
            ${this.tableName} (id, channel, username, palName)
            VALUES ($id, $channel, $username, $palName)`
        );
        return query.run({ $id, $channel, $username, $palName });
    }

    async resetPalForUserInChannelAsAdmin($channel: string, $username: string) {
        const query = await this._queryDb(
            `DELETE FROM ${this.tableName}
            WHERE channel = $channel AND username = $username`
        );
        return query.run({ $channel, $username });
    }
}

export const palworldDb = new PalwordNamesDatabaseController();
