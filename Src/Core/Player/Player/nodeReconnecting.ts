import { Shoukaku } from 'shoukaku';
import Logger from '../../../Resources/Console/MuzoxConsole.js'
export default function nodeReconnecting(shoukaku: Shoukaku) {
  shoukaku.on('reconnecting', (name,reconnect) => {
    Logger.log(`: Node Reconnecting :: ${name} `,"[Warn]")
    
  });
}
