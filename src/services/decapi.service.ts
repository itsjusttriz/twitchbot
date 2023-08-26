import axios from 'axios';
import { logger } from '../utils/Logger';

const api = axios.create({
    baseURL: 'https://decapi.me',
    headers: {
        'user-agent': 'com.itsjusttriz.twitchbot',
    },
});

export const decApi = {
    async calculate(exp: string) {
        const qs = new URLSearchParams({ exp });
        const resp = await api.get(`/math?${qs}`).catch((e) => {
            logger.svcDecApi.error(e);
            return { data: undefined };
        });

        return resp.data;
    },
};
