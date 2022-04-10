export default {
    name: 'part',
    once: false,
    run: (channel, username, self, client) =>
    {
        if (!self)
            return;

        console.info('Left', channel)
    }
}