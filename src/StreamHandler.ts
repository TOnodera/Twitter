import { Request, Response } from "express";
import Messages from "./Messages";
import { logger } from "./utility";
import events from "events";
import moment from "moment";
import EventEmitter from "node:events";

class StreamHandler{

    private stream: EventEmitter;
    private iterable: any;
    constructor(stream: EventEmitter){
        this.stream = stream;
        this.iterable = events.on(this.stream,'data');
    }

    async handler(req: Request, res: Response){

        //sseでの接続を宣言
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        });

        for await (const [event] of this.iterable){
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
    }
}

export default StreamHandler;