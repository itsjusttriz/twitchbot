import { DatabaseControllerBase } from './DatabaseControllerBase';

export type RaidEventType = {
    channel: string;
    condition: number;
    disabled: 0 | 1;
    loggable: 0 | 1;
    outcome: string;
};

class ChannelRaidDatabaseController extends DatabaseControllerBase {
    constructor() {
        super('twitch_channel_raid_outcomes');
    }

    async createRaidOutcome($channel: string) {
        const query = await this._queryDb(
            `INSERT OR IGNORE
            INTO ${this.tableName} (channel)
            VALUES ($channel)`
        );
        return query.run({ $channel });
    }

    async getRaidOutcome($channel: string) {
        const query = await this._queryDb(
            `SELECT * FROM ${this.tableName} 
            WHERE channel = $channel`
        );
        return query.get<RaidEventType>({ $channel });
    }

    async toggleRaidOutcome($channel: string, $shouldDisable: boolean) {
        const query = await this._queryDb(
            `UPDATE ${this.tableName} 
            SET disabled = $disabled 
            WHERE channel = $channel`
        );
        return query.run({ $channel, $disabled: !$shouldDisable ? 0 : 1 });
    }

    async toggleLogging($channel: string, $shouldDisable: boolean) {
        const query = await this._queryDb(
            `UPDATE ${this.tableName}
            SET loggable = $loggable
            WHERE channel = $channel`
        );
        return query.run({ $channel, $loggable: !$shouldDisable ? 1 : 0 });
    }

    async updateOutcomeMessage($channel: string, $message: string) {
        const query = await this._queryDb(
            `UPDATE ${this.tableName} 
            SET message = $message 
            WHERE channel = $channel`
        );
        return query.run({ $channel, $message });
    }

    async updateOutcomeCondition($channel: string, $condition: number) {
        const query = await this._queryDb(
            `UPDATE ${this.tableName} 
            SET condition = $condition 
            WHERE channel = $channel`
        );
        return query.run({ $channel, $condition });
    }
}

export const raidEventDb = new ChannelRaidDatabaseController();
