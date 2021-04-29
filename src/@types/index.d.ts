interface Url {
    url: string,
    display_url: string
}

interface Message {
    id: number,
    name: string,
    text: string,
    src: string,
    date: string,
    time: string,
    dayOfMonth: string,
    urls: Url[]
}

