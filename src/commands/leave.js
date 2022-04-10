//         case 'leave': {
//     if (!permissionsMet(user, 'caster'))
//         return client.say(channel, 'You don\'t have permission for this!');

//     if (!args[0])
//         return client.say(channel, 'Cannot detect a channel to leave');

//     let success = [];
//     let fail = [];

//     for (const c of args)
//     {
//         const alreadyLeft = !client.getChannels().includes(c);
//         if (alreadyLeft)
//         {
//             fail.push(c);
//             continue;
//         }
//         await client.part(c);
//         success.push(c)

//     }
//     chatResponse = `Left channel(s): ${success && success.length > 1 ? success.join(', ') : (success[0] || 'None')} || Failed: ${fail && fail.length > 1 ? fail.join(', ') : (fail[0] || 'None')}`
//     break;
// }