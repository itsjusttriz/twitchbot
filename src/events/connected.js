import fetch from "node-fetch";

export default {
    name: 'connected',
    once: true,
    run: async (address, port, client) =>
    {
        console.table([{ address, port }])
        console.info('Connected!');

        const channels = await getChannels().catch(console.error);
        channels?.map(p => p.channel_name).forEach(c => client.join(c));
    }
}

async function getChannels()
{
    const api = await fetch('https://api.itsjusttriz.com/twitch/twitch-bot-channels?raw=true');
    if (api.status === 200)
        return (await api.json()).payload;
}