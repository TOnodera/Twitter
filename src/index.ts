import { app } from './server';
import { Request, Response } from 'express';
import moment = require('moment');
import { stream } from './stream';

//インメモリでメッセージを100件保持しておく
const messages: Message[] = [];



app.get('/streams', (req: Request, res: Response) => {

    //sseでの接続を宣言
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
    });

    stream.on('data', (event: any) => {

        if (event) {

            const datetime = moment(new Date(event.created_at));
            const date = datetime.format("YYYY-MM-DD");
            const time = datetime.format("h:mm:ss");
            const dayOfMonth = datetime.format("MM/DD");

            if (event.user) {

                const message: Message = { name: event.user.name, text: event.text, src: event.user.profile_background_image_url_https, date: date, time: time, dayOfMonth: dayOfMonth, urls: event.entities.urls };
                res.write("data: " + JSON.stringify(message));
                res.write("\n\n");//sseのフォーマットに沿って１つのメッセージの終わりに改行２ついれる

                messages.unshift(message);
                if (messages.length > 100) {
                    messages.pop();
                }

            }

        }
    });

});

app.get('/start', (req: Request, res: Response) => {
    res.json(messages);
});

app.listen(process.env.APP_SERVER_PORT, () => {
    console.log("listening start...");
});

