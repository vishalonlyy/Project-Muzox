import { CommandInteraction } from "discord.js";
import Queue from "../../Structures/Queue.js";
import Muzox from "../../Structures/Muzox_Client.js";

export async function  getQueue(client : Muzox, guildId: string,interaction:CommandInteraction) {
  const memberid = interaction.member?.user.id;
  const voiceState = interaction.guild?.voiceStates.cache.get(memberid);
  const bVc: any = interaction.guild?.members.me;
  const bvccheck: any = interaction.guild?.voiceStates.cache.get(bVc);
  const guildId_: any = interaction.guild?.id;
  const channelId: any = voiceState?.channelId;
  const node = client.shoukaku.getIdealNode();
 
  let player = node.players.get(guildId)
  if(!player){
    player = await client.shoukaku.joinVoiceChannel({
      guildId: guildId_,
      channelId: channelId,
      shardId: interaction.guild.shardId,
      deaf: true,
    })
  } else console.error();
 
  if (!client.queue.has(guildId)) {
    client.queue.set(guildId, new Queue(guildId,player));
  }
  return client.queue.get(guildId);
}

