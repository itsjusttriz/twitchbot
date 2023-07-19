import { Logger } from "@itsjusttriz/logger";
import { HTTP_Methods } from "@itsjusttriz/utils";
import fetch from "node-fetch";
import { LogPrefixes, logger as _logger } from "../utils/Logger";

const API_BASE = 'https://api.itsjusttriz.com';

type _ApiCallProps = {
    method?: HTTP_Methods | keyof typeof HTTP_Methods;
    path: string;
    qs?: URLSearchParams;
    expectedResponseType?: 'string' | 'json';
}

type ApiResult = {
    hasFailed: boolean;
    result: any;
}

const logger: Logger = _logger.setPrefix(LogPrefixes.SERVICES_IJT_API);

export class IjtApi {

    private constructor() { }

    private static async _callApi(props: _ApiCallProps = { method: "GET", path: "", qs: undefined, expectedResponseType: 'string' }): Promise<ApiResult> {
        const { method, path, qs, expectedResponseType } = props;
        const url = new URL(path, API_BASE);
        if (qs)
            qs.forEach((v, k) => url.searchParams.append(k, v))

        return await fetch(url, {
            method
        }).then(async data => {
            if (!data.ok) {
                logger.error(props);
                return {
                    hasFailed: true,
                    result: data
                };
            }
            return {
                hasFailed: false,
                result: expectedResponseType === 'string' ? await data.text() : await data.json()
            }
        }).catch(e => {
            logger.error(props);
            return {
                hasFailed: true,
                result: e
            }
        })
    }

    static async getModpack(id: string) {
        const props: _ApiCallProps = {
            method: "GET",
            path: `/minecraft/get/${id}`,
            qs: new URLSearchParams({
                raw: 'true'
            }),
            expectedResponseType: 'json'
        };

        const call = await this._callApi(props);
        if (call.hasFailed)
            return;

        return call.result;
    }

    static async isNightbotAvailable() {
        const props: _ApiCallProps = {
            method: "GET",
            path: '/nightbot/multiline',
            qs: new URLSearchParams({
                msgs: 'test'
            })
        };

        const api = await this._callApi(props);
        if (api.hasFailed)
            return false;

        return true;
    }
}