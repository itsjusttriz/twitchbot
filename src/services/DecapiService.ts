import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/Logger';

class DecapiService {
    private _api: AxiosInstance;

    constructor() {
        this._api = axios.create({
            baseURL: 'https://decapi.me',
            headers: {
                'user-agent': 'ijtdev/twitchbot',
            },
        });
    }

    async calculate(exp: string) {
        const qs = new URLSearchParams({ exp });

        try {
            const resp = await this._api.get(`/math?${qs}`);
            return resp.data;
        } catch (error) {
            logger.svcDecApi.error(error);
            return;
        }
    }
}

export const decapiService = new DecapiService();
