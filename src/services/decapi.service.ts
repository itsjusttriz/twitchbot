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

        try {
            const resp = await api.get(`/math?${qs}`);
            return resp.data;
        } catch (error) {
            logger.svcDecApi.error(error);
            return { data: undefined };
        }
    },
};
