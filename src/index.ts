import { app } from './server';
import { Request, Response } from 'express';
import moment = require('moment');
import { stream } from './stream';
import Messages from './messages';


stream.on('data', (event: any) => {

    if (event) {

        const datetime = moment(new Date(event.created_at));
        const date = datetime.format("YYYY-MM-DD");
        const time = datetime.format("h:mm:ss");
        const dayOfMonth = datetime.format("MM/DD");

        if (event.user) {

            const src: string = event.user.profile_background_image_url_https == 'unkown' ? '' : event.user.profile_background_image_url_https
            const message: Message = { id: event.id, name: event.user.name, text: event.text, src: src, date: date, time: time, dayOfMonth: dayOfMonth, urls: event.entities.urls };

            //新たに受信したメッセージをMessagesオブジェクト内の配列に突っ込む
            Messages.set(message);

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

    //Message内の配列を監視して変更があったらデータ送信
    Messages.handle((message: Message) => {
        res.write("data: " + JSON.stringify(message));
        res.write("\n\n");
    });

});

//ページに最初に訪問した時に１度だけ実行される。サーバーのインメモリのキャッシュから最大１００件のデータを返す
app.get('/start', (req: Request, res: Response) => {
    res.json(Messages.get());
});

//サーバー起動
app.listen(process.env.APP_SERVER_PORT, () => {
    console.log("listening start...");
});

