import { EmbedBuilder, Message } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, FindQueue, EmojisPacket } from '../../../Resources/modules/index.js';
import { MusicPlaying_FirstRow, Muzox_PauseClicked, Muzox_Playing_SecondRow } from '../../../Display/GlobalEmbeds/privateButtons.js';


export default <messageCommands>{
    data: {
        name: 'pause',
        description: 'pause the current playing track/song',
        vote: false,
        voice: true,
        queue: true,
        player: true,
        botconnection: true,
        permissions: ['EmbedLinks'],
        slash: true,
        SlashData: {
            Name: 'pause',
            options: []
          },
          
    },
    execute: async (client: Muzox, message: ContextManager, args: string[]) => {



        try {
            if(message.CheckInteraction){
                message.setDeffered(false);
            }
            //await interaction.deferReply()
            const memberid = message.author.id;
            const voiceState = message.guild?.voiceStates.cache.get(memberid);
            const guildId: any = message.guild?.id;
            const channelId: any = voiceState?.channelId;
            const node = client.shoukaku.getIdealNode();


            let player = node.players.get(guildId);
            const ctx = new ContextManager(message, args);
      //const queue: any = client.queue.get(guildId);
            const queue: Queue = await FindQueue(client, guildId, ctx.message || ctx.ctx)//client.queue.get(guildId);

            //Embeds
            const PauseEmbed = new EmbedBuilder()
                .setDescription(Messages.Messages.Paused + queue.title)
                .setColor(Messages.Mconfigs.color)
            const AlreadyPaused = new EmbedBuilder()
                .setDescription(Messages.Error.AlreadyPaused)
                .setColor(Messages.Mconfigs.Ecolor)


            //Statements 

            if (queue && !player?.paused) {
                player?.setPaused(true);
                if(queue.mainmsg){
                    queue.mainmsg?.edit({
                        components : [Muzox_PauseClicked, Muzox_Playing_SecondRow]
                    }).cache(e=>{})
                }
                // queue.mainmsg?.edit({
                //     components : [Muzox_PauseClicked, Muzox_Playing_SecondRow]
                // }).cache(e=> {})
                message.react('⏸️').catch(e=>{
                    message.reply({embeds: [ new EmbedBuilder()
                        .setColor(Messages.Mconfigs.color)
                        .setDescription(`${message.channel.permissionsFor(client.user).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.TracKStart.pause}` : `${EmojisPacket.Emojis.NormalEmojis.Pause} ${Messages.Messages.Paused}`}`)
                    ]})
                })

                // message.reply({
                //     embeds: [PauseEmbed]
                // })
            }
            else if (queue && player?.paused) {
                player.setPaused(true)
                message.reply({
                    embeds: [AlreadyPaused]
                })
            } else {
                message.reply({
                    content: 'Something went wrong while pausing',
                })
            }
        } catch (e) {
            Logger.log(e,"Error")
        }
    }

}
