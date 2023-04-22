import { BasicObjectProps } from "@itsjusttriz/utils";
import fetch from "node-fetch";
import { LogPrefixes, logger } from "../../utils/Logger";

const API_BASE_URL = 'https://api.itsjusttriz.com/minecraft/get';

export async function getPackFromApi(id: string) {
    return await fetch(`${API_BASE_URL}/${id}?raw=true`)
        .then(resp => resp.json())
        .then((json: BasicObjectProps) => json.payload)
        .catch(e => {
            logger
                .setPrefix(LogPrefixes.SERVICES_IJT_API)
                .error(`Failed to fetch from ${API_BASE_URL}:`, e);
            return null;
        })
}   