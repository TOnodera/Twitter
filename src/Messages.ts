
class Messages {

    //インメモリでメッセージをMAX_CACHE_NUM件保持しておく
    private static messages: Message[] = [];
    private static MAX_CACHE_NUM = 100;

    static set(message: Message) {
        this.messages.unshift(message);
        if (this.messages.length >= this.MAX_CACHE_NUM) {
            this.messages.pop();
        }
    }

    static get(): Message[] {
        return Messages.messages;
    }

}

export default Messages;