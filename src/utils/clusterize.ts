import * as _cluster from 'cluster';
import { cpus as osCpus } from 'os';
const cluster = _cluster as unknown as _cluster.Cluster; // typings fix

const numberOfCores = osCpus().length;

export function clusterize(callback: CallableFunction) {
  if (cluster.isPrimary) {
    console.log(`Master server started on ${process.pid}`);

    cluster.on('exit', (worker) => {
      console.log(`Worker ${worker.process.pid} died. Restarting`);

      cluster.fork();
    });

    for (let i = 0; i < numberOfCores; i++) {
      cluster.fork();
    }
  } else {
    console.log(`Cluster server started on ${process.pid}`);
    callback();
  }
}
