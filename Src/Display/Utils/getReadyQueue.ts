import { CommandInteraction } from "discord.js";
import Queue from "../../Structures/Queue.js";
import Muzox from "../../Structures/Muzox_Client.js";

export async function  RgetQueue(client : Muzox, guildId: string, JoinChannel : string | any, ShardId : string | any) {


  let nodes = client.shoukaku.getIdealNode();
 
  let player = nodes.players.get(guildId)
  if(!player){
    player = await client.shoukaku.joinVoiceChannel({
      guildId: guildId,
      channelId: JoinChannel,
      shardId: ShardId,
      deaf: true,
      
     
      
    })
    
  } else console.error();
 
  if (!client.queue.has(guildId)) {
    client.queue.set(guildId, new Queue(guildId,player));
  }
  return client.queue.get(guildId);
}

