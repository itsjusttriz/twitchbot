import express from 'express';
import { logger } from '../../utils/logger';
const app = express();

app.head('/', (req, res) => {
    logger.success('[System/Backend] Backend called upon!');
    res.status(200).end();
    return;
});

export const loadBackend = () => {
    return new Promise((res, rej) => {
        res(app.listen(8082, () => logger.success('[System/Backend] Backend Loaded!')))
    });
}