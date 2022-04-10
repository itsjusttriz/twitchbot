export default {
    name: 'connected',
    once: true,
    run: (address, port, client) =>
    {
        console.table([{ address, port }])
        console.info('Connected!');

        client.join('itsjusttriz')
    }
}