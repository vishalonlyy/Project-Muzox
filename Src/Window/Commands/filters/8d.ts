import { CommonEmbed } from '../../../Display/GlobalEmbeds/privateFilterEmbeds.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, EmojisPacket, Messages } from '../../../Resources/modules/index.js';
export default <messageCommands>{
  data: {
    name: '8d',
    description: 'Add/switch filter to 8d/3d for playing track/songs',
    vote: false,
    type: 1,
    voice: true,
    queue: true,
    player: true,
    samevc: true,
    botconnection: true,
    aliases: ["3d"],
    permissions: ['SendMessages', 'EmbedLinks'],
    slash: true,
    SlashData: {
        Name: '8d',
        options: []
      },

  },
  execute: async (client: Muzox, message: ContextManager, args: string[]) => {
    if(message.CheckInteraction){
      await message.setDeffered(false);
      }

    try {
      const memberid = message?.author?.id;
      const botid: any = message.guild?.members.me?.id;
      const voiceState = message.guild?.voiceStates.cache.get(memberid);
      const bvoiceState = message.guild?.voiceStates.cache.get(botid);

      const memberVoiceChannel = voiceState?.channel;
      const botVoiceChannel = bvoiceState?.channel;
      const guildId: any = message.guild?.id;
      const channelId: any = voiceState?.channelId;
      const node = client.shoukaku.getIdealNode();
      let player = node.players.get(guildId);
      const queue: Queue = client.queue.get(guildId);
      if (queue && player) {
        if (queue.filters.includes('8d')) {
          queue.player.setRotation()
          queue.filters.splice(queue.filters.indexOf('8d', 1))
          message.reply({
            embeds: [CommonEmbed.setDescription(`${EmojisPacket.Emojis.Wrong} 8D ${Messages.Mfilters.Deactivated}`)]
          })
        } else {
          queue.player.setRotation({ rotationHz: 0.2 })
          queue.filters.push('8d')
          message.reply({
            embeds: [CommonEmbed.setDescription(`${EmojisPacket.Emojis.correct} 8D ${Messages.Mfilters.Activated}`)]
          })
        }
      }
    } catch (e) {
      Logger.log(e,"Error")
    }
  }
}
