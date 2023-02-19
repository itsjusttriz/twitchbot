import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import { TableNames } from './types/sql-table-names';

let _cachedDatabase: Promise<Database<sqlite3.Database, sqlite3.Statement>>;

export const getDB = async () => {
    return _cachedDatabase ?? (_cachedDatabase = open({
        filename: './ijt-twitchbot.db',
        driver: sqlite3.Database
    }));
};

/**
 * * --- GENERAL --- *
 */

export const getAllRows = async (table: keyof typeof TableNames) => {
    const stmt = (await getDB()).prepare(`SELECT * FROM ${TableNames[table]}`)
    return (await stmt).all();
}

export const getJoinableChannels = async () => {
    const stmt = (await getDB()).prepare(`SELECT name FROM ${TableNames.CONNECTED_CHANNELS} WHERE blacklisted = 0`);
    return (await stmt).all();
}

// TODO: Test this.
export const addIdToChannel = async (id: string) => {
    const stmt = (await getDB()).prepare(`INSERT INTO ${TableNames.CONNECTED_CHANNELS} (id) VALUES (?) WHERE id NOT EXISTS`);
    return (await stmt).run(id);
}