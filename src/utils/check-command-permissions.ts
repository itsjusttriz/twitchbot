import { ChatUserstate } from "tmi.js";
import { Permissions } from "./enums/permissions-type";

export function isVip(tags: ChatUserstate) {
    return !!tags.badges.vip;
}

export function isSubOrAbove(tags: ChatUserstate) {
    return !!tags['subscriber'] || !!tags['badges']?.['subscriber'] || !!tags['badges']?.['founder'] || isModOrAbove(tags);
}

export function isModOrAbove(tags: ChatUserstate) {
    return !!tags['mod'] || !!tags['badges']?.['moderator'] || isCasterOrAbove(tags);
}

export function isCasterOrAbove(tags: ChatUserstate) {
    return !!tags['badges']?.['broadcaster'] || tags['room-id'] === tags['user-id'] || isOwner(tags);
}

export function isOwner(tags: ChatUserstate) {
    return [tags.id, tags['user-id']].includes('127667640');
}

export function getPermissions(tags: ChatUserstate) {
    return {
        [Permissions.OWNER]: isOwner(tags),
        [Permissions.CASTER]: isCasterOrAbove(tags),
        [Permissions.MODERATOR]: isModOrAbove(tags),
        [Permissions.VIP]: isVip(tags),
        [Permissions.SUBSCRIBER]: isSubOrAbove(tags),
        [Permissions.REGULAR]: true
    }
}

export function hasPermission(tags: ChatUserstate, reqPerm: Permissions) {
    return getPermissions(tags)[reqPerm];
}