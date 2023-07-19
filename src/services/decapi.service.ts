import { Logger } from "@itsjusttriz/logger";
import { HTTP_Methods, StringOnlyObjectProps } from "@itsjusttriz/utils";
import { LogPrefixes, logger as _logger } from "../utils/Logger";
import fetch from "node-fetch";

const API_BASE: string = 'https://decapi.me';

type _ApiCallProps = {
    method?: HTTP_Methods | keyof typeof HTTP_Methods;
    path: string;
    qs?: URLSearchParams;
    expectedResponseType?: 'json' | 'string';
}

type ApiResult = {
    hasFailed: boolean;
    result: any;
}

const logger: Logger = _logger.setPrefix(LogPrefixes.SERVICES_DECAPI);

export class DecApi {
    private static headers: StringOnlyObjectProps = {
        'user-agent': 'com.itsjusttriz.twitchbot'
    };

    private constructor() { }

    private static async _callApi(props: _ApiCallProps = { method: "GET", path: "", qs: undefined, expectedResponseType: 'string' }): Promise<ApiResult> {
        const { method, path, qs, expectedResponseType } = props;
        const url = new URL(path, API_BASE);
        if (qs)
            qs.forEach((v, k) => url.searchParams.append(k, v))

        return await fetch(url, {
            method: props.method,
            headers: this.headers
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

    static async doMath(exp: string) {

        const props: _ApiCallProps = {
            method: "GET",
            path: `/math`,
            qs: new URLSearchParams({
                exp
            })
        };

        const call = await this._callApi(props);
        if (call.hasFailed)
            return;

        return call.result;
    }
}