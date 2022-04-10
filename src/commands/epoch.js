//         case 'epoch':
// if (!permissionsMet(user, 'all'))
//     return client.say(channel, 'You don\'t have permission for this!');

// if (!args.length)
//     return client.say(channel, 'Cannot find time string in your message.');

// const reg = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;
// if (!reg.test(args.join(' ')))
//     return client.say(channel, 'Your input does not meet timestring requirements e.g. yyyy-mm-ddT07:00')

// chatResponse = new Date(args.join(' ')).getTime() / 1000;
// break;