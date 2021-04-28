require('dotenv').config();

const Twitter = require('twitter');
const client = new Twitter({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_KEY_SECRET,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});
const stream = client.stream('statuses/filter', { track: process.env.TRACK_WORDS, locale: 'ja', lang: 'ja' });

export {
    stream
};