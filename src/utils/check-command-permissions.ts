import { ChatUserstate } from "tmi.js";
import { Permissions } from "./types/permissions-type";

async function isSub(tags: ChatUserstate) {
    return !!tags['subscriber'] || !!tags['badges']?.['subscriber'] || !!tags['badges']?.['founder'] || await isMod(tags);
}

async function isMod(tags: ChatUserstate) {
    return !!tags['mod'] || !!tags['badges']?.['moderator'] || await isCaster(tags);
}

async function isCaster(tags: ChatUserstate) {
    return !!tags['badges']?.['broadcaster'] || tags['room-id'] === tags['user-id'] || await isOwner(tags);
}

async function isOwner(tags: ChatUserstate) {
    return tags['user-id'] === '127667640';
}

export async function getPermissions(tags: ChatUserstate) {
    return {
        [Permissions.OWNER]: await isOwner(tags),
        [Permissions.CASTER]: await isCaster(tags),
        [Permissions.MODERATOR]: await isMod(tags),
        [Permissions.SUBSCRIBER]: await isSub(tags),
        [Permissions.REGULAR]: true
    }
}

export async function hasPermission(tags: ChatUserstate, reqPerm: Permissions) {
    return await getPermissions(tags)[reqPerm];
}