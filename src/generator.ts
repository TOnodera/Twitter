import events from "events";
import moment from "moment";
import EventEmitter from "node:events";
import { logger } from "./utility";

async function* generator(stream: EventEmitter): AsyncGenerator<Message>{
    const iterable = events.on(stream,'data');
    for await (const [event] of iterable){
        const datetime = moment(new Date(event.created_at));
        const date = datetime.format("YYYY-MM-DD");
        const time = datetime.format("h:mm:ss");
        const dayOfMonth = datetime.format("MM/DD");

        if (event.user) {
            const src: string = event.user.profile_background_image_url_https == 'unkown' ? '' : event.user.profile_background_image_url_https
            const message: Message = { id: event.id, name: event.user.name, text: event.text, src: src, date: date, time: time, dayOfMonth: dayOfMonth, urls: event.entities.urls };

            //新たに受信したメッセージを通知
            yield message;
        }else{
            logger.debug("event.userが無いのでエラーを投げました");
        }
    }
}



export { generator };