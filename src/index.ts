import { app } from './server';
import { Request, Response } from 'express';
import moment = require('moment');
import { stream } from './stream';

//インメモリでメッセージを100件保持しておく
const messages: Message[] = [];
const messagesProxy = new Proxy(messages, {
    set: (obj, prop, message: Message) => {
        messageCallback(message);
        return true;
    }
});

//ハンドラ
let handler = (message: Message) => { };

const notice = (message: Message) => {
    handler(message);
}

//MessageProxyがデータ受け取った時に渡すためのコールバック
const messageCallback = (message: Message) => {
    notice(message);
};

//新しいタイムラインをどんどん配列に入れていく
stream.on('data', (event: any) => {

    if (event) {

        const datetime = moment(new Date(event.created_at));
        const date = datetime.format("YYYY-MM-DD");
        const time = datetime.format("h:mm:ss");
        const dayOfMonth = datetime.format("MM/DD");

        if (event.user) {

            const message: Message = { name: event.user.name, text: event.text, src: event.user.profile_background_image_url_https, date: date, time: time, dayOfMonth: dayOfMonth, urls: event.entities.urls };
            messagesProxy.unshift(message);

            if (messagesProxy.length > 100) {
                messagesProxy.pop();
            }

        }

    }
});




app.get('/streams', (req: Request, res: Response) => {

    //sseでの接続を宣言
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
    });

    //Messageを監視して変更があったらデータ送信
    handler = (message: Message) => {
        res.write("data: " + JSON.stringify(message));
        res.write("\n\n");
    };


});

app.get('/start', (req: Request, res: Response) => {
    res.json(messages);
});

app.listen(process.env.APP_SERVER_PORT, () => {
    console.log("listening start...");
});

