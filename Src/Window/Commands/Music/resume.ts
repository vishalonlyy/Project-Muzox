import { EmbedBuilder, Message } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, EmojisPacket } from '../../../Resources/modules/index.js';
import { Muzox_PauseCancelled, Muzox_Playing_SecondRow } from '../../../Display/GlobalEmbeds/privateButtons.js';


export default <messageCommands>{
    data: {
        name: 'resume',
        description: 'resume the current paused track/song',
        vote: false,
        voice: true,
        queue: true,
        player: true,
        botconnection: true,
        permissions: ['EmbedLinks', 'SendMessages'],
        slash: true,
        SlashData: {
            Name: 'resume',
            options: []
          },
    },
    execute: async (client: Muzox, message: ContextManager, args: string[]) => {



        try {
            if(message.CheckInteraction){
                message.setDeffered(false);
            }
            const memberid = message?.author.id;
            const voiceState = message.guild?.voiceStates.cache.get(memberid);
            const guildId: any = message.guild?.id;
            const channelId: any = voiceState?.channelId;
            const node = client.shoukaku.getIdealNode();


            let player = node.players.get(guildId);
            const queue: Queue = client.queue.get(guildId);

            //Embeds
            const ResumeEmbed = new EmbedBuilder()
                .setDescription(Messages.Messages.resumed + queue.title)
                .setColor(Messages.Mconfigs.color)
            const AlreadyResumed = new EmbedBuilder()
                .setDescription(`${message.channel.permissionsFor(client.user).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.Wrong}` : `${EmojisPacket.Emojis.NormalEmojis.Wrong} ${Messages.Error.AlreadyPaused}`}`)
                .setColor(Messages.Mconfigs.Ecolor)


            //Statements 

            if (queue && player?.paused) {
                player?.setPaused(false)
                if(queue.mainmsg){
                    queue.mainmsg.edit({
                    components : [Muzox_PauseCancelled, Muzox_Playing_SecondRow]
                }) .cache(e=>{})
                }
               
                message.react('▶️').catch(e=>{
                    message.reply({embeds: [ new EmbedBuilder()
                        .setColor(Messages.Mconfigs.color)
                        .setDescription(`${message.channel.permissionsFor(client.user).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.TracKStart.resume}` : `${EmojisPacket.Emojis.NormalEmojis.Play} ${Messages.Messages.resumed}`}`)
                    ]})
                })
                // message.reply({
                //     embeds: [ResumeEmbed]
                // })
            }
            else if (queue && !player?.paused) {
                player?.setPaused(false)
                message.reply({
                    embeds: [AlreadyResumed]
                })
            } else {
                message.reply({
                    content: 'Something went wrong while resuming',
                })
            }
        } catch (e) {
            Logger.log(e,"Error")
        }
    }
}
