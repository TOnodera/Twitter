import moment from "moment";
import { logger } from "./utility";

function get(stream: any): Promise<Message> {
    return new Promise((resolve, reject) => {
        stream.once('data', (event: any) => {

            const datetime = moment(new Date(event.created_at));
            const date = datetime.format("YYYY-MM-DD");
            const time = datetime.format("h:mm:ss");
            const dayOfMonth = datetime.format("MM/DD");

            if (event.user) {

                const src: string = event.user.profile_background_image_url_https == 'unkown' ? '' : event.user.profile_background_image_url_https
                const message: Message = { id: event.id, name: event.user.name, text: event.text, src: src, date: date, time: time, dayOfMonth: dayOfMonth, urls: event.entities.urls };

                //新たに受信したメッセージを通知
                resolve(message);
            } else {
                reject(event);
            }
        });
    });
}

async function* generator(stream: any) {
    while (true) {
        try {
            yield await get(stream);
        } catch (e) {
            logger.debug("event.userが無いのでエラーを投げました");
        }
    }
}


export { generator };