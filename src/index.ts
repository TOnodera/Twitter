import { app } from './server';
import { corsSetting } from './setting';
import { Request, Response } from 'express';
import moment = require('moment');
import { stream } from './stream';


app.get('/streams', corsSetting, (req: Request, res: Response) => {

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
                res.write("data: " + JSON.stringify({ name: event.user.name, text: event.text, src: event.user.profile_background_image_url_https, date: date, time: time, dayOfMonth: dayOfMonth, urls: event.entities.urls }));
                res.write("\n\n");//sseのフォーマットに沿って１つのメッセージの終わりに改行２ついれる
            }

        }
    });

});

app.listen(process.env.APP_SERVER_PORT, () => {
    console.log("listening start...");
});

