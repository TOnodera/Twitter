import { get } from '../stream';

describe("SSEサーバーのテスト", () => {

    it('jest起動確認', () => {
        expect(1).toBe(1);
    });

    it('get()でメッセージを一件取得できる', async () => {
        const message: Message = await get();
        expect(typeof message.id).toBe('number');
    });

    it('get()のループで複数件データを取得できる', async () => {
        for (let i = 0; i < 5; i++) {
            const message: Message = await get();
            expect(typeof message.id).toBe('number');
        }
    });
});