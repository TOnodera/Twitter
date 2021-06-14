

class Messages {

    //インメモリでメッセージをMAX_CACHE_NUM件保持しておく
    private static messages: Message[] = [];
    private static MAX_CACHE_NUM = 100;

    static set(message: Message) {
        Messages.messages.unshift(message);
        if (Messages.messages.length >= Messages.MAX_CACHE_NUM) {
            Messages.messages.pop();
        }
    }

    static cache(): Message[] {
        return Messages.messages;
    }
}

export default Messages;