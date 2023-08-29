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

        try {
            const resp = await api.get(`/minecraft/get/${id}?${qs}`);
            return resp.data;
        } catch (error) {
            logger.svcIjtApi.error(error);
            return { data: undefined };
        }
    },

    async checkNightbotStatus() {
        const qs = new URLSearchParams({ msgs: 'test' });

        try {
            const resp = await api.get(`/nightbot/multiline?${qs}`);
            return resp.data && resp.data?.code === 200;
        } catch (error) {
            logger.svcIjtApi.error(error);
            return false;
        }
    },
};
