export default {
    name: 'join',
    once: false,
    run: (channel, username, self, client) =>
    {
        if (!self)
            return;

        console.info('Joined', channel)
    }
}