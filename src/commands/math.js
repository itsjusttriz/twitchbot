//         case 'math':
//         case 'calc':
// if (!permissionsMet(user, 'sub'))
//     return client.say(channel, 'You don\'t have permission for this!');

// if (!args[0])
//     return client.say(channel, 'No calculation detected. Try again!');

// if (args.length >= 2)
//     return client.say(channel, 'Calculations must not be space-seperated. ex: 2+2 instead of 2 + 2');

// await fetch(`https://decapi.me/math/?exp=${encodeURIComponent(args[0])}`)
//     .then(resp => resp.text())
//     .then(result => chatResponse = result);
// break;