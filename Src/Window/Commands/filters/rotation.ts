import { CommonEmbed } from '../../../Display/GlobalEmbeds/privateEmbeds.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, EmojisPacket, Messages } from '../../../Resources/modules/index.js';
export default <messageCommands>{
  data: {
    name: 'rotation',
    description: 'Add/switch filter to rotate the audio for playing track/songs',
    vote: false,
    type: 1,
    voice: true,
    queue: true,
    player: true,
    samevc: true,
    botconnection: true,
    permissions: ['SendMessages', 'EmbedLinks'],
    slash: true,
    SlashData: {
      Name: 'rotation',
      options: []
    },
  },
  execute: async (client: Muzox, message: ContextManager, args: string[]) => {
    const x = message
    try {
      
      if (message.CheckInteraction) {
        await message.setDeffered(false);
      };
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
        if (queue.filters.includes('rotation')) {
          queue.player.setRotation()
          queue.filters.splice(queue.filters.indexOf('rotation', 1))
          message.reply({
            embeds: [CommonEmbed.setDescription(`${EmojisPacket.Emojis.Wrong} Rotation ${Messages.Mfilters.Deactivated}`)]
          })
        } else {
          queue.player.setRotation({ rotationHz: 0 });
          queue.filters.push('rotation');
          message.reply({
            embeds: [CommonEmbed.setDescription(`${EmojisPacket.Emojis.correct} Rotation ${Messages.Mfilters.Activated}`)]
          })
        }
      }
    } catch (e) {
      Logger.log(e, "Error")
    }
  }

}