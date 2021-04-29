import { app } from './server';
import { Request, Response } from 'express';
import moment = require('moment');
import { stream } from './stream';

//ユーザー定義タイプガード
const isImplmentsMessage = (arg: any): arg is Message => {
    return arg != null &&
        typeof arg.name == 'string' &&
        typeof arg.text == 'string' &&
        typeof arg.src == 'string' &&
        typeof arg.date == 'string' &&
        typeof arg.time == 'string' &&
        typeof arg.dayOfMonth == 'string' &&
        typeof arg.urls == 'object';
}

//インメモリでメッセージを100件保持しておく
const messages: Message[] = [];

//Messageの変更監視するためにプロキシ
const messagesProxy = {
    set: (message: Message) => {
        messages.unshift(message);
        messageCallback(message);
        if (messages.length >= 100) {
            messages.pop();
        }
    }
};

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

            const src: string = event.user.profile_background_image_url_https == 'unkown' ? '' : event.user.profile_background_image_url_https
            const message: Message = { id: event.id, name: event.user.name, text: event.text, src: src, date: date, time: time, dayOfMonth: dayOfMonth, urls: event.entities.urls };

            messagesProxy.set(message);

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
        //console.log(message.id_str, message.name, moment(new Date()).format('YYYY-MM-DD h:mm:ss'));
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

