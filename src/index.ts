import launch from "./launch";
import stream from "./stream";

/*
//クラスタ化実行してサーバ
if (clustor.isMaster) {
    for (let i = 0; i < 1; i++) {
        clustor.fork();
    }
} else {
    launch(stream);
}
*/

launch(stream);
