import { Embed, EmbedBuilder, Guild, Message } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, FindQueue, EmojisPacket } from '../../../Resources/modules/index.js';

export default <messageCommands>{
  data: {
    name: 'clear',
    description: 'clear all your song/tracks queued',
    voice: true,
    queue: true,
    player: true,
    botconnection: true,
    slash: true,
    vote : false,
    SlashData: {
        Name: 'clear',
        options: []
      },
  },
  execute: async (client: Muzox, message: ContextManager, args: string[]) => {

   
    try {
      const memberid = message?.author?.id;
      const voiceState = message.guild?.voiceStates.cache.get(memberid);
      const guildId: any = message.guild?.id;
      const channelId: any = voiceState?.channelId;
      const ctx = new ContextManager(message, args);
      const queue: Queue = await FindQueue(client, guildId, ctx.message || ctx.ctx)
      const node = client.shoukaku.getIdealNode();
      const player = node.players.get(guildId)
      //Embeds
      const SkippingEmbed = new EmbedBuilder()
        .setDescription(`${message.channel.permissionsFor(client.user).has('UseExternalEmojis') ? `${EmojisPacket.Emojis?.correct}` : `${EmojisPacket?.Emojis?.NormalEmojis?.tick}`} ${Messages?.Messages?.trackcleared}`)
        .setColor(Messages.Mconfigs.color)
        
      const NoSongsLeft = new EmbedBuilder()
        .setDescription(Messages.Utils.QueueEnded)
        .setColor(Messages.Mconfigs.Ucolor)

      if (queue.size) {
        message.reply({
          embeds: [SkippingEmbed]
        }).then(async () => {
          // queue.clear();
          queue.playing = false;
          queue.exec = false
          queue.clear();

        });
      } else {
        queue.clear();
        queue.playing = false;
        queue.exec = false;
        message.reply({
          embeds: [NoSongsLeft]
        });
      }
    } catch (e) {
      
    }

  }
}
