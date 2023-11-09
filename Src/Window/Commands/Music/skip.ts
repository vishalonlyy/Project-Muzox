import { EmbedBuilder, Message, TextBasedChannel, TextChannel } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, FindQueue, EmojisPacket } from '../../../Resources/modules/index.js';


export default <messageCommands>{
  data: {
    name: 'skip',
    description: 'skip the current track/song',
    vote: false,
    voice: true,
    queue: false,
    player: true,
    samevc: true,
    botconnection: true,
    permissions:['SendMessages','EmbedLinks','Connect'],
    slash: true,
    SlashData: {
        Name: 'skip',
        options: []
      },

  },
  execute: async (client: Muzox, message: ContextManager, args: string[]) => {


    try {
      if(message.CheckInteraction){
        await message.setDeffered(false);
      }

      const memberid = message?.author.id;
      const voiceState = message.guild?.voiceStates.cache.get(memberid);
      const guildId: any = message.guild?.id;
      const channelId: any = voiceState?.channelId;
      const ctx = new ContextManager(message, args);
      //const queue: any = client.queue.get(guildId);
      const queue: Queue = await FindQueue(client, guildId, ctx.message || ctx.ctx)
      const node = client.shoukaku.getIdealNode();
      const player = node.players.get(guildId)
      const x : Queue = await client.queue.get(guildId)
      //Embeds
     
        // .addFields(
        //   { name: 'Queue Left: ', value: `${queue.size - 1}` },
        // )

      // const NoSongsLeft = new EmbedBuilder()
      //   .setDescription(Messages.Utils.QueueEnded)
      //   .setColor(Messages.Mconfigs.Ucolor)
      //   .setTitle(Messages.Title.QueueEnd)
      //   


      if (queue.size > 1) {
        const SkippingEmbed = new EmbedBuilder()//Messages.Messages.Skipping + `[${queue.tracks[0].info.title}](${Messages.Links.SupportLink})`
        .setDescription(`${message.channel.permissionsFor(client.user).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.TracKStart.skip}` : `${EmojisPacket.Emojis.NormalEmojis.Skip} ${Messages.Messages.Skipping} [${queue.tracks[0].info.title}](${Messages.Links.SupportLink})`}`)
        .setColor(Messages.Mconfigs.color)
        ;
        message.react('⏩').catch(e=>{
          message.reply({
            embeds: [SkippingEmbed]
          })
        })
        .then(async (msg) => {
          //console.log(queue.playing)
          queue.playing = true;
          queue.skip()
          // .then(()=> 
          // {
          //   setTimeout(()=> {
          //     msg.delete().catch(e=>Logger.log(e,'Error'))
          //   },3000)
          // }
          // )
          // //console.log(queue.playing)
        });
      } else {
        //console.log('I am executed when i am the last song in the queue')
        queue.skip();
        queue.eventEmitter.emit('TQemitter')
        // message.reply({
        //   embeds: [NoSongsLeft]
        // });
      }
    } catch (e) {
      Logger.log(e,"Error")
    }

  }
}
