import dotenv from 'dotenv';
import Logger from './Resources/Console/MuzoxConsole.js';
import colors from 'colors';
import { createInterface } from 'readline';
dotenv.config();
interface Config {
  token: string;
  clientId: string;
  DevMode: boolean;
  status: any;
  Dprefix: any;
  TopGGApiKey : string;
  userName: string;
  guildLogs: string;
  shardLogs: string,
  shardAlerts: string;
  ClientReadyLogs: string;
  logs: boolean,
  devs: string[];
  searchEngine: string;
  mode: {
    maintenance: boolean | null;
    reason: string | null;
    estimation: string | null;
  };
  lavalink: {
    url: string;
    auth: string;
    name: string;
    secure?: boolean;
  }[];
}
const config = (): Config => {
  const config: Config = {
    DevMode: true,
    token: process.env.Token,// Main bots token 
    clientId : '',// Main bots client id
    status: process.env.status,
    TopGGApiKey : process.env.TopGGApiKey,
    Dprefix: process.env.Dprefix, // Bot Prefix for message Commands
    userName: process.env.BotUsername, // Bot Username
    guildLogs: process.env.GuildLogs,
    shardLogs: process.env.ShardLogs || '',// ChannelId where to send the Shard realted events 
    shardAlerts: process.env.ShardAlerts || '',// ChannelId where to send Shard alert events
    ClientReadyLogs: process.env.ReadyLogs || '',// ChannelId where to send Bot Ready Events
    logs: false,// True / Flase [True : send the logs in shardLogs,shardAlerts,clientReadyLogs 🟢] | [False : It wonnt send any logs 🔴]
    devs: process.env.OwnerIds.split(','), // Owners ids for dev acess commands
    searchEngine: process.env.SearchEngine,
    // Bot maintenance mode 
    mode: {
      maintenance: false, // True / False [True : maintenance mode activated], [False : maintenace mode deactivated]
      reason: process.env.MaintenanceReason || '', // Maintenance mode reason [to notify users when cmd is triggered & maintenace : True]
      estimation: process.env.Estimation || 'Currently No Estimations applied' // Maintenance mode time / string estimations
    },
    lavalink: [
      {
        url: process.env.LavalinkUrl, // Lavalink url format : [host:port]
        auth: process.env.LavalinkAuth, // Lavalink password
        name: process.env.LavalinkName, // Lavalink name [any]
        secure: false, // secure [True / False]
      },
    ],
  };
  // Checks
  if (config.token === '' || null || "") {
    Logger.log(": Invalid token was provied or wasn\'t provided", "[Warn]")
  }
  if (config.mode.maintenance === null) {
    Logger.log(": No mode present Bot may not start", "[Warn]");
  }
  if (config.mode.maintenance === true && config.mode.reason === null || '') {
    Logger.log(`: Reason is not provided while maintenance is ${colors.bold.green("Active")}`, "[Warn]")
  }
  if(config.TopGGApiKey === '' || null){
    Logger.log(": Top.gg Api Key Invalid ?? Not Provided [Critical]", "[Warn]")
  }
  //Test System
  // if(config.token === ''){
  //   console.log('Trying New node Values')
  //   config.logs = false;
  //   config.clientId = '1023825986455867455';
  //    config.lavalink = [
  //      {
  //       url : process.env.TestLavaUrl,
  //       auth: process.env.TestLavaAuth,
  //       name: process.env.TestLavaName,
  //       secure: false,
  //      }
  //   ]
  // }
  return config;
};
export default config();
