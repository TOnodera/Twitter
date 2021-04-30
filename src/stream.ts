import Messages from "./Messages";

require('dotenv').config();
const moment = require('moment');
const Twitter = require('twitter');
const client = new Twitter({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_KEY_SECRET,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

const stream = client.stream('statuses/filter', { track: process.env.TRACK_WORDS, locale: 'ja', lang: 'ja' });

function get(): Promise<Message> {
    return new Promise((resolve) => {
        if (stream.listenerCount('data') == 0) {
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

                }
            });
        }
    });
}


export { get };