import { DatabaseControllerBase } from './DatabaseControllerBase';

export type RedemptionType = {
    id: string;
    title?: string;
    channel: string;
    loggable: boolean;
    disabled: boolean;
    outcome?: string;
};

class ChannelPointsRedemptionsDatabaseController extends DatabaseControllerBase {
    constructor() {
        super('twitch_cp_redemptions');
    }

    async createRedemption($channel: string, $id: string) {
        const query = await this._queryDb(
            `INSERT OR IGNORE
            INTO ${this.tableName} (channel, id)
            VALUES ($channel, $id)`
        );
        return query.run({ $channel, $id });
    }

    async getRedemption($id: string) {
        const query = await this._queryDb(
            `SELECT * FROM ${this.tableName}
            WHERE id = $id`
        );
        return query.get<RedemptionType>({ $id });
    }

    async toggleOutcomeMessage($id: string, $shouldDisable: boolean) {
        const query = await this._queryDb(
            `UPDATE ${this.tableName}
            SET disabled = $disabled
            WHERE id = $id`
        );
        return query.run({ $id, $disabled: !$shouldDisable ? 0 : 1 });
    }

    async toggleLogging($id: string, $shouldDisable: boolean) {
        const query = await this._queryDb(
            `UPDATE ${this.tableName}
            SET loggable = $loggable
            WHERE id = $id`
        );
        return query.run({ $id, $loggable: !$shouldDisable ? 1 : 0 });
    }

    async setTitle($id: string, $title: string) {
        const query = await this._queryDb(
            `UPDATE ${this.tableName}
            SET title = $title
            WHERE id = $id`
        );
        return query.run({ $id, $title });
    }

    async setOutputMessage($id: string, $value: string) {
        const query = await this._queryDb(
            `UPDATE ${this.tableName}
            SET outcome = $value
            WHERE id = $id`
        );
        return query.run({ $id, $value });
    }
}

export const cpRedemptionsDb = new ChannelPointsRedemptionsDatabaseController();
