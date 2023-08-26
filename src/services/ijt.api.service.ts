import axios from 'axios';
import { logger } from '../utils/Logger';

const api = axios.create({
    baseURL: 'https://api.itsjusttriz.com',
    headers: {
        'user-agent': 'com.itsjusttriz.twitchbot',
    },
});

export const ijtApi = {
    async getModpack(id: string) {
        const qs = new URLSearchParams({ raw: 'true' });
        const resp = await api.get(`/minecraft/get/${id}?${qs}`).catch((e) => {
            logger.svcIjtApi.error(e);
            return { data: undefined };
        });

        return resp.data;
    },

    async checkNightbotStatus() {
        const qs = new URLSearchParams({ msgs: 'test' });
        const resp = await api.get(`/nightbot/multiline?${qs}`).catch((e) => {
            logger.svcIjtApi.error(e);
            return { data: undefined };
        });

        return !resp.data ? false : true;
    },
};
