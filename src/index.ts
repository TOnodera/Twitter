import launch from './launch';
import clustor from 'cluster';
import os from 'os';
import stream from './stream';

const cpus = os.cpus();


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