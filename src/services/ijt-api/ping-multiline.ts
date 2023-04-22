import fetch from "node-fetch";
import { LogPrefixes, logger } from "../../utils/Logger";

const API_BASE_URL = 'https://api.itsjusttriz.com/nightbot/multiline';

export async function isNightbotMultilineAvailable() {
    return await fetch(API_BASE_URL)
        .then(resp => {
            if (!resp.ok || resp.status !== 200)
                return false;
            return true;
        })
        .catch(e => {
            logger.setPrefix(LogPrefixes.SERVICES_IJT_API).error(`Failed to fetch from ${API_BASE_URL}:`, e);
            return false;
        });
}   