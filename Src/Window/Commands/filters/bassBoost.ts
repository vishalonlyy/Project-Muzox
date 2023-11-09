import { CommonEmbed } from '../../../Display/GlobalEmbeds/privateEmbeds.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, EmojisPacket, Messages } from '../../../Resources/modules/index.js';
export default <messageCommands>{
  data: {
    name: 'bassboost',
    description: 'Add/switch filter to bassboost for playing track/songs',
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
        Name: 'bassboost',
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
        if (queue.filters.includes('bassboost')) {
          queue.player.setEqualizer([])
          queue.filters.splice(queue.filters.indexOf('bassboost', 1))
          message.reply({
            embeds: [CommonEmbed.setDescription(`${EmojisPacket.Emojis.Wrong} BassBoost ${Messages.Mfilters.Deactivated}`)]
          })
        } else {
          queue.filters.push('bassboost')
          queue.player.setEqualizer([
            { band: 0, gain: 0.34 },
            { band: 1, gain: 0.34 },
            { band: 2, gain: 0.34 },
            { band: 3, gain: 0.34 },
          ]);
          message.reply({
            embeds: [CommonEmbed.setDescription(`${EmojisPacket.Emojis.correct} BassBoost ${Messages.Mfilters.Activated}`)]
          })
        }
      }
    } catch (e) {
      Logger.log(e,"Error")
    }
  }
}

