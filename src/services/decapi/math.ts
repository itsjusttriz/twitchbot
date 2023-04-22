import fetch from "node-fetch";
import { LogPrefixes, logger } from "../../utils/Logger";

const API_BASE_URL = 'https://decapi.me/math/';

/**
 * Calls to https://decapi.me/math and returns result of mathematical equation given by {expression}.
 */
export async function mathApi(expression: string) {
    return await fetch(`${API_BASE_URL}?exp=${encodeURIComponent(expression)}`, {
        headers: {
            'user-agent': 'com.itsjusttriz.twitchbot'
        }
    })
        .then(resp => resp.text())
        .catch(e => {
            logger.setPrefix(LogPrefixes.SERVICES_DECAPI).error(`Failed to fetch from ${API_BASE_URL}:`, e);
            return null;
        })
}   