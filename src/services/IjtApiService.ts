import { logger } from '../utils/Logger';
import { ApiServiceBase } from './ApiServiceBase';

class IjtApiService extends ApiServiceBase {
    constructor() {
        super({
            baseURL: 'https://api.itsjusttriz.com',
            headers: {
                'user-agent': 'ijtdev/twitchbot',
            },
        });
    }

    async getModpack(id: string) {
        const qs = new URLSearchParams({ raw: 'true' });

        try {
            const resp = await this._api.get(`/minecraft/get/${id}?${qs}`);
            return resp.data;
        } catch (error) {
            logger.svcIjtApi.error(error);
            return;
        }
    }

    async checkNightbotStatus() {
        const qs = new URLSearchParams({ msgs: 'test' });

        try {
            const resp = await this._api.get(`/nightbot/multiline?${qs}`);
            return resp.data && resp.data?.code === 200;
        } catch (error) {
            logger.svcIjtApi.error(error);
            return false;
        }
    }
}

export const ijtapiService = new IjtApiService();
