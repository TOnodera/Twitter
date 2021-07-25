import { app } from "./server";
import { Request, Response } from "express";
import Messages from "./Messages";
import { logger } from "./utility";
import EventEmitter from "node:events";
import StreamHandler from './StreamHandler';

const launch = (stream: EventEmitter) => {

  //メイン処理
  const streamHandler = new StreamHandler(stream);
  app.get("/streams",streamHandler.handler);

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
