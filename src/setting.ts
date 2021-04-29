require('dotenv').config();
import cors from 'cors';

const corsOptions = {
    origin: `${process.env.WEB_SERVER_URL}:${process.env.WEB_SERVER_PORT}`,
    credentials: true
}

const corsSetting = cors(corsOptions);

console.log(corsOptions);

export {
    corsSetting
}