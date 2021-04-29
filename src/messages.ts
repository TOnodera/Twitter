class Messages {

    //インメモリでメッセージをMAX_CACHE_NUM件保持しておく
    private static messages: Message[] = [];
    private static MAX_CACHE_NUM = 100;
    private static handler: (message: Message) => void;

    static set(message: Message) {
        this.messages.unshift(message);
        this.messageCallback(message);
        if (this.messages.length >= this.MAX_CACHE_NUM) {
            this.messages.pop();
        }
    }

    static handle(handler: (message: Message) => void) {
        this.handler = handler;
    }

    private static messageCallback(message: Message) {
        if (this.handler != undefined) {
            this.handler(message);
        }
    }

    static get(): Message[] {
        return this.messages;
    }

}

export default Messages;