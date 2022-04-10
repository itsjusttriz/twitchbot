
/**
 *
 * @param {import("tmi.js").ChatUserstate} tags
 * @returns {Promise<boolean>}
 */
async function isSub(tags)
{
    return !!tags['subscriber'] || !!tags['badges']?.['subscriber'] || !!tags['badges']?.['founder'] || await isMod(tags);
}

/**
 *
 * @param {import("tmi.js").ChatUserstate} tags
 * @returns {Promise<boolean>}
 */
async function isMod(tags)
{
    return !!tags['mod'] || !!tags['badges']?.['moderator'] || await isCaster(tags);
}

/**
 * 
 * @param {import("tmi.js").ChatUserstate} tags 
 * @returns {Promise<boolean>}
 */
async function isCaster(tags)
{
    return !!tags['badges']?.['broadcaster'] || tags['room-id'] === tags['user-id'] || await isOwner(tags);
}

/**
 * 
 * @param {import("tmi.js").ChatUserstate} tags 
 * @returns {Promise<boolean>}
 */
async function isOwner(tags)
{
    return tags['user-id'] === '127667640';
}

/**
 * 
 * @param {import("tmi.js").ChatUserstate} tags
 * @returns 
 */
export const getPermissions = async (tags) => ({
    'owner': await isOwner(tags),
    'caster': await isCaster(tags),
    'mod': await isMod(tags),
    'sub': await isSub(tags),
    '*': true
})

/**
 * 
 * @param {import("tmi.js").ChatUserstate} tags
 * @param {import('./types/permission-types.js').PermissionTypes} reqPerm 
 * @returns 
 */
export async function hasPermission(tags, reqPerm)
{
    return await getPermissions(tags)[reqPerm];
}