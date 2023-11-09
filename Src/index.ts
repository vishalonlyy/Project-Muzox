import { config } from 'dotenv';
import { resolve } from 'path';

//config({path:resolve('dist','..','.env')})

 

process.on('unhandledRejection', (reason, p) => {
  console.log(reason, p);
});
process.on('uncaughtException', (err, origin) => {
  console.log(err, origin);
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log(err, origin);
});

import './Cluster.js';
