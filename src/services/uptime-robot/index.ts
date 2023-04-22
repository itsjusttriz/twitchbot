import express from 'express';
import { LogPrefixes, logger } from '../../utils/Logger';
const app = express();

app.head('/', (req, res) => {
    logger.setPrefix(LogPrefixes.SERVICES_BACKEND).success('Backend called upon!');
    res.status(200).end();
    return;
});

export const loadBackend = () => {
    return new Promise((res, rej) => {
        res(app.listen(8082, () => logger.setPrefix(LogPrefixes.SERVICES_BACKEND).success('Backend Loaded!')))
    });
}