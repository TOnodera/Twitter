require('dotenv').config();
const client = require('./client');
const stream = client.stream('statuses/filter', { track: process.env.TRACK_WORDS, locale: 'ja', lang: 'ja' });

export default stream;