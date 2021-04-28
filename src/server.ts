import Express from 'express';
import { corsSetting } from './setting';

const app: Express.Application = Express();

app.use(corsSetting);

export {
    app
}