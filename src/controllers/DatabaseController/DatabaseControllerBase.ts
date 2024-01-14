import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { TableNames } from '../../utils/constants';

let _cachedDatabase: Promise<Database<sqlite3.Database, sqlite3.Statement>>;
export const getDB = async () => {
    const filePath = path.resolve(__dirname, '../../../ijt-twitchbot.db');
    return (_cachedDatabase ??= open({
        filename: filePath,
        driver: sqlite3.Database,
    }));
};

type TableNameKeys = keyof typeof TableNames;
type TableNameValues = (typeof TableNames)[TableNameKeys];

export class DatabaseControllerBase {
    protected tableName: TableNameValues = undefined;
    constructor(tableName: TableNameValues) {
        this.tableName = tableName;
    }

    protected async _queryDb(sql: string) {
        const db = await getDB();
        return await db.prepare(sql);
    }

    async getAllRows() {
        if (!this.tableName) throw new Error('Unsure of which table to perform getAllRows() on.');
        const query = await this._queryDb(`SELECT * FROM ${this.tableName}`);
        return query.all();
    }
}
