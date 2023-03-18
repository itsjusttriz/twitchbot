import { ChatUserstate } from "tmi.js";
import { Permissions } from "./types/permissions-type";

export async function isSubOrAbove(tags: ChatUserstate) {
    return !!tags['subscriber'] || !!tags['badges']?.['subscriber'] || !!tags['badges']?.['founder'] || await isModOrAbove(tags);
}

export async function isModOrAbove(tags: ChatUserstate) {
    return !!tags['mod'] || !!tags['badges']?.['moderator'] || await isCasterOrAbove(tags);
}

export async function isCasterOrAbove(tags: ChatUserstate) {
    return !!tags['badges']?.['broadcaster'] || tags['room-id'] === tags['user-id'] || await isOwner(tags);
}

export async function isOwner(tags: ChatUserstate) {
    return tags['user-id'] === '127667640';
}

export async function getPermissions(tags: ChatUserstate) {
    return {
        [Permissions.OWNER]: await isOwner(tags),
        [Permissions.CASTER]: await isCasterOrAbove(tags),
        [Permissions.MODERATOR]: await isModOrAbove(tags),
        [Permissions.SUBSCRIBER]: await isSubOrAbove(tags),
        [Permissions.REGULAR]: true
    }
}

export async function hasPermission(tags: ChatUserstate, reqPerm: Permissions) {
    return await getPermissions(tags)[reqPerm];
}