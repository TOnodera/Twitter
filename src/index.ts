require('dotenv').config();
import Express, { Request, Response } from 'express';

const Twitter = require('twitter');
const client = new Twitter({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_KEY_SECRET,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

const stream = client.stream('statuses/filter', { track: 'こんにちは' });



const app: Express.Application = Express();
app.get('/streams', (req: Request, res: Response) => {

    //sseでの接続を宣言
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
    });

    stream.on('data', (event: any) => {
        if (event) {
            res.write(JSON.stringify({ url: event.profile_background_image_url_https });
        }
    });

});

app.listen(3000, () => {
    console.log("listening start...");
});

