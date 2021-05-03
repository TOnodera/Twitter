import { app } from './server';
import { Request, Response } from 'express';
import { generator } from './generator';
import Messages from './Messages';

const launch = (stream: any) => {
    app.get('/streams', async (req: Request, res: Response) => {


        //sseでの接続を宣言
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });

        for await (const message of generator(stream)) {
            Messages.set(message); //キャッシュ用
            res.write("data: " + JSON.stringify(message));
            res.write("\n\n");
        }

    });

    //ページに最初に訪問した時に１度だけ実行される。サーバーのインメモリのキャッシュから最大１００件のデータを返す
    app.get('/start', (req: Request, res: Response) => {
        res.json(Messages.cache());
    });

    //サーバー起動
    app.listen(process.env.APP_SERVER_PORT, () => {
        console.log("listening start...");
    });
}

export default launch;
