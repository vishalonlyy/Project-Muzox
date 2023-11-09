import { Shoukaku } from 'shoukaku';
import Logger from '../../../Resources/Console/MuzoxConsole.js'
export default function nodeDestroy(shoukaku: Shoukaku) {
  shoukaku.on('disconnect', (name,reconnect) => {
    Logger.log(`: Node Disconnected :: ${name} || Reconnected [${reconnect}]`,"Lavalink")
    
  });
}
