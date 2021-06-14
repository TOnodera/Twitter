import { app } from "./server";
import { Request, Response } from "express";
import Messages from "./Messages";
import { logger } from "./utility";
import EventEmitter from "node:events";
import events from "events";
import moment from "moment";

const launch = (stream: EventEmitter) => {
  app.get("/streams", async (req: Request, res: Response) => {

    //sseでの接続を宣言
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    const iterable = events.on(stream,'data');
    for await (const [event] of iterable){
        const datetime = moment(new Date(event.created_at));
        const date = datetime.format("YYYY-MM-DD");
        const time = datetime.format("h:mm:ss");
        const dayOfMonth = datetime.format("MM/DD");

        if (event.user) {
            const src: string = event.user.profile_background_image_url_https == 'unkown' ? '' : event.user.profile_background_image_url_https
            const message: Message = { id: event.id, name: event.user.name, text: event.text, src: src, date: date, time: time, dayOfMonth: dayOfMonth, urls: event.entities.urls };

            //新たに受信したメッセージを出力
            Messages.set(message); //キャッシュ用
            res.write("data: " + JSON.stringify(message));
            res.write("\n\n");
        }else{
            logger.debug("event.userが無いのでエラーを投げました");
        }
    }
  });

  //ページに最初に訪問した時に１度だけ実行される。サーバーのインメモリのキャッシュから最大１００件のデータを返す
  app.get("/start", (req: Request, res: Response) => {
    res.json(Messages.cache());
  });

  //サーバー起動
  app.listen(process.env.APP_SERVER_PORT, () => {
    console.log("listening start...");
  });

  process.on("unhandledRejection", (reason, p) => {
    logger.fatal(`補足されない例外を検出しました。プロセスを終了します。: ${p},reason: ${reason}`);
  });
};

export default launch;
