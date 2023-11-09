import { Message } from "discord.js";
import Queue from "../../Structures/Queue.js";
import Muzox from "../../Structures/Muzox_Client.js";

export async function  MgetQueue(client :Muzox, guildId: string, message:Message)
 {
  const memberid = message.member?.user.id;
  const voiceState = message.guild?.voiceStates.cache.get(memberid);
  const bVc: any = message.guild?.members.me;
  const bvccheck: any = message.guild?.voiceStates.cache.get(bVc);
  const guildId_: any = message.guild?.id;
  const channelId: any = voiceState?.channelId;
  let node : any = client.shoukaku.getIdealNode();
 
  let player = node.players.get(guildId)
  if(!player){
    player = await client.shoukaku.joinVoiceChannel({
      guildId: guildId_,
      channelId: channelId,
      shardId: message.guild.shardId,
      deaf: true,
      // getIdealNode(node, connection) {
      //   node = [ ...nodes.values() ];
      //   return nodes.find(node => node.group === connection.region);
      // },
    })
  } console.error();
 
  if (!client.queue.has(guildId)) {
    client.queue.set(guildId, new Queue(guildId,player));
  }
  return client.queue.get(guildId);
}

