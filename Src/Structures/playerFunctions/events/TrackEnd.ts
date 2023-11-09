import { Logger } from "../../../Resources/modules/index.js";
import Queue from "../../Queue.js";

async function TrackEnd(x:Queue){
    try {
        x.playing = true;
        await x.mainmsg.delete().catch(e => Logger.log(e, 'Error'))
      } catch (e) {
      }
}

export default TrackEnd; 