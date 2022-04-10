//         case 'join': {
//     if (!permissionsMet(user, 'caster'))
//         return client.say(channel, 'You don\'t have permission for this!');

//     if (!args[0])
//         return client.say(channel, 'Cannot detect a channel to join');

//     let success = [];
//     let fail = [];

//     for (const c of args)
//     {
//         const alreadyJoined = client.getChannels().includes(c);
//         if (alreadyJoined)
//         {
//             fail.push(c);
//             continue;
//         }
//         await client.join(c);
//         success.push(c)

//     }
//     chatResponse = `Joined channel(s): ${success && success.length > 1 ? success.join(', ') : (success[0] || 'None')} || Failed: ${fail && fail.length > 1 ? fail.join(', ') : (fail[0] || 'None')}`
//     break;
// }