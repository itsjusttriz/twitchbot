import { BasicObjectProps } from "@itsjusttriz/utils";
import fetch from "node-fetch";

const API_BASE_URL = 'https://api.itsjusttriz.com/minecraft/get';

export async function getPackFromApi(id: string) {
    return await fetch(`${API_BASE_URL}/${id}?raw=true`)
        .then(resp => resp.json())
        .then((json: BasicObjectProps) => json.payload)
        .catch(e => {
            console.warn(`[Error] Failed to fetch from ${API_BASE_URL}: ` + e);
            return null;
        })
}   