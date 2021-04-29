require('dotenv').config();
import cors from 'cors';

const origin = process.env.NODE_ENV == 'prod'
    ? `${process.env.WEB_SERVER_URL}`
    : 'http://localhost';

const corsOptions = {
    origin: origin,
    credentials: true
}

const corsSetting = cors(corsOptions);

console.log(corsOptions);

export {
    corsSetting
}