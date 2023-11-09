import { Cluster, ClusterManager,HeartbeatManager, getInfo } from 'discord-hybrid-sharding';
import path from 'path';
import dotenv, { config } from 'dotenv';



const manager = new ClusterManager(`./dist/Core/Client/Muzox.js`, {
  totalShards: 'auto',
  shardsPerClusters: 2,
  mode: 'process',
  totalClusters: 'auto',
  token: config().parsed?.Token,
  
})

 manager.extend(
   new HeartbeatManager({
       interval: 2000,  //Interval to send a heartbeat
       maxMissedHeartbeats: 5, //Maximum amount of missed Heartbeats until Cluster will get respawned
   })
 )
manager.on('clusterCreate', cluster => {
  console.log(`Cluster ${cluster.id} launched`);
});
manager.on('clusterReady',cluster => {
  console.log(`Cluster ready #${cluster.id}`)
})

 

 process.on('unhandledRejection', (reason, p) => {
   console.log(reason, p);
 });
 process.on('uncaughtException', (err, origin) => {
   console.log(err, origin);
 });
 process.on('uncaughtExceptionMonitor', (err, origin) => {
   console.log(err, origin);
 });

manager.spawn({timeout: -1})
