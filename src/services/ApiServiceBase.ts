import axios, { AxiosInstance } from 'axios';

type ApiServiceProps = {
    baseURL: string;
    defaultQueryParams?: Record<string, any>;
    headers?: Record<string, any>;
};

export class ApiServiceBase {
    protected _api: AxiosInstance;
    protected defaultQueryParams: URLSearchParams;

    constructor({ baseURL, defaultQueryParams, headers }: ApiServiceProps) {
        this._api = axios.create({
            baseURL,
            headers: {
                'User-Agent': 'ijtdev/twitchbot',
                ...headers,
            },
        });

        this.defaultQueryParams = new URLSearchParams({ ...defaultQueryParams });
    }

    protected buildQueryParams(params: Record<string, any>): Record<string, any> {
        return { ...this.defaultQueryParams, ...params };
    }
}
