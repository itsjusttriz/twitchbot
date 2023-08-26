import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import { TableNames } from './constants';

let _cachedDatabase: Promise<Database<sqlite3.Database, sqlite3.Statement>>;

export const getDB = async () => {
    return (_cachedDatabase ??= open({
        filename: './ijt-twitchbot.db',
        driver: sqlite3.Database,
    }));
};

/**
 * * --- GENERAL --- *
 */

export const getAllRows = async (table: keyof typeof TableNames) => {
    const sql = `SELECT * FROM ${TableNames[table]}`;
    const db = await getDB();
    const stmt = await db.prepare(sql);
    return stmt.all();
};

/**
 * * --- Event Management --- *
 */
export const addChannelEvent = async (channel: string, event: string) => {
    if (event !== 'raided') return;

    const sql = `INSERT INTO ${TableNames.TWITCH_CHANNEL_EVENT_RESPONSES} (channel, event) VALUES (?, ?)`;
    const db = await getDB();
    const stmt = await db.prepare(sql);
    return stmt.run(channel, event);
};

export const getChannelEvent = async (channel: string, event: string) => {
    const sql = `SELECT * FROM ${TableNames.TWITCH_CHANNEL_EVENT_RESPONSES} WHERE channel=$channel AND event=$event`;
    const db = await getDB();
    const stmt = await db.prepare(sql);
    return stmt.get({
        $channel: channel,
        $event: event,
    });
};

export const toggleChannelEvent = async (channel: string, event: string, value: boolean) => {
    const sql = `UPDATE ${TableNames.TWITCH_CHANNEL_EVENT_RESPONSES} SET disabled=$value WHERE channel=$channel AND event=$event`;
    const db = await getDB();
    const stmt = await db.prepare(sql);
    return stmt.run({
        $value: !value ? 1 : 0,
        $channel: channel,
        $event: event,
    });
};

export const updateChannelRaidEventMessage = async (channel: string, event: string, value: string) => {
    const sql = `UPDATE ${TableNames.TWITCH_CHANNEL_EVENT_RESPONSES} SET message=$value WHERE channel=$channel AND event=$event`;
    const db = await getDB();
    const stmt = await db.prepare(sql);
    return stmt.run({
        $value: value,
        $channel: channel,
        $event: event,
    });
};

export const updateChannelRaidEventTrigger = async (channel: string, event: string, value: string) => {
    const num = parseInt(value);
    if (isNaN(num)) return;

    const sql = `UPDATE ${TableNames.TWITCH_CHANNEL_EVENT_RESPONSES} SET trigger=$value WHERE channel=$channel AND event=$event`;
    const db = await getDB();
    const stmt = await db.prepare(sql);
    return stmt.run({
        $value: value,
        $channel: channel,
        $event: event,
    });
};

/**
 * * --- Heart Emotes --- *
 */

export const getUsableHeartEmotes = async () => {
    const sql = `SELECT emoteName FROM ${TableNames.TWITCH_HEART_EMOTES} WHERE disabled = 0`;
    const db = await getDB();
    const stmt = await db.prepare(sql);
    return stmt.all();
};

export const addHeartEmote = async (channel: string, value: string) => {
    const sql = `INSERT OR REPLACE INTO ${TableNames.TWITCH_HEART_EMOTES} (channel, emoteName, disabled) VALUES ($channel, $emoteName, 0)`;
    const db = await getDB();
    const stmt = await db.prepare(sql);
    return stmt.run({
        $channel: channel,
        $emoteName: value,
    });
};

export const removeHeartEmote = async (value: string) => {
    const sql = `DELETE FROM ${TableNames.TWITCH_HEART_EMOTES} WHERE emoteName=$value`;
    const db = await getDB();
    const stmt = await db.prepare(sql);
    return stmt.run({
        $value: value,
    });
};

export const toggleHeartEmotesByChannel = async (channel: string, value: boolean) => {
    const sql = `UPDATE ${TableNames.TWITCH_HEART_EMOTES} SET disabled=$value WHERE channel=$channel`;
    const db = await getDB();
    const stmt = await db.prepare(sql);
    return stmt.run({
        $channel: channel,
        $value: !value ? 1 : 0,
    });
};

/**
 * * --- Channel Management --- *
 */

export const getJoinableChannels = async () => {
    const sql = `SELECT name FROM ${TableNames.CONNECTED_CHANNELS} WHERE blacklisted = 0`;
    const db = await getDB();
    const stmt = await db.prepare(sql);
    return stmt.all();
};

export const addChannelToStoredChannels = async (channel: string) => {
    const sql = `INSERT OR REPLACE INTO ${TableNames.CONNECTED_CHANNELS} (name, blacklisted) VALUES (?, 0)`;
    const db = await getDB();
    const stmt = await db.prepare(sql);
    return stmt.run(channel);
};

export const updateBlacklistedChannels = async (channel: string, value: boolean) => {
    const sql = `UPDATE ${TableNames.CONNECTED_CHANNELS} SET blacklisted=$value WHERE name=$channel`;
    const db = await getDB();
    const stmt = await db.prepare(sql);
    return stmt.run({
        $channel: channel,
        $value: !value ? 0 : 1,
    });
};

/**
 * * --- Discord Webhooks --- *
 */

export const getValidDiscordWebhookURLs = async () => {
    const table = await getAllRows('DISCORD_WEBHOOK_URLS');
    return table;
};

export const addDiscordWebhookURL = async (channel: string, url: string) => {
    const sql = `INSERT OR REPLACE INTO ${TableNames.DISCORD_WEBHOOK_URLS} (channel, url) values ($channel, $url)`;
    const db = await getDB();
    const stmt = await db.prepare(sql);
    return stmt.run({
        $channel: channel,
        $url: url,
    });
};

/**
 * * --- Work In Progress --- *
 */

// TODO: Test this.
export const addIdToChannel = async (channel: string, id: string) => {
    const sql = `INSERT INTO ${TableNames.CONNECTED_CHANNELS} (id) VALUES (?) WHERE name = ? AND id NOT EXISTS`;
    const db = await getDB();
    const stmt = await db.prepare(sql);
    return stmt.run(id, channel);
};
