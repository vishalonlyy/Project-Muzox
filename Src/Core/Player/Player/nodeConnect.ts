import { Shoukaku } from 'shoukaku';
import Logger from '../../../Resources/Console/MuzoxConsole.js';
import Muzox from '../../../Structures/Muzox_Client.js';
import { PrismaClient } from '@prisma/client';

export default async function registerNodeConnectEvent(shoukaku: Shoukaku, x: Muzox) {
  shoukaku.on('ready', async (name, reconnect) => {
    Logger.log(`Node Connected :: ${name} || Reconnected [${reconnect}]`, "Lavalink");
    
  })

  
}
