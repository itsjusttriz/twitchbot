export default {
    name: 'connected',
    once: true,
    run: (address, port, client) =>
    {
        console.info('Connected to:', { address, port });
        client.join('itsjusttriz')
    }
}