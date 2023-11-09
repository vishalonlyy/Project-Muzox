import { EmbedBuilder, Message } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, formatTime, FindQueue } from '../../../Resources/modules/index.js';

export default <messageCommands>{
    data: {
        name: 'nowplaying',
        description: 'display the current playing songs info',
        vote: false,
        type: 1,
        voice: true,
        queue: true,
        player: true,
        samevc: true,
        botconnection: true,
        aliases: ["np"],
        permissions: ['EmbedLinks', 'SendMessages'],
        slash: true,
        SlashData: {
            Name: 'nowplaying',
            options: []
        },
        

    },
    execute: async (client: Muzox, message: ContextManager, args: string[]) => {


        try {
            if(message.CheckInteraction){
                await message.setDeffered(false);
                }

            const memberid = message?.author.id;
            const botid: any = message.guild?.members.me?.id;
            const voiceState = message.guild?.voiceStates.cache.get(memberid);
            const bvoiceState = message.guild?.voiceStates.cache.get(botid);

            const memberVoiceChannel = voiceState?.channel;
            const botVoiceChannel = bvoiceState?.channel;
            const guildId: any = message.guild?.id;
            const channelId: any = voiceState?.channelId;
            const node = client.shoukaku.getIdealNode();

            let player = node.players.get(guildId);



            //Statements
            
            //const queue: any = client.queue.get(guildId);
            const queue: Queue = await FindQueue(client, guildId, message.message || message.ctx)

            //Embeds

            const rejectEmbed = new EmbedBuilder()
                .setDescription(Messages.Error.notsameVC)
                .setColor(Messages.Mconfigs.Ecolor)

            if (memberVoiceChannel === botVoiceChannel && queue.playing === true) {
                const sucessEmbed = new EmbedBuilder()
                    .setDescription('Now Playing')
                    .setColor(Messages.Mconfigs.color)
                    .setFields(
                        { name: 'Duration', value: `${formatTime(queue.currentTimeLeft)}`, inline: true },
                        { name: 'Song By', value: `${queue.currentTrack.info.author}`, inline: true },
                        { name: `Requester`, value: `${message.author.username}`, inline: true }
                    )
                    .setDescription(`[${queue.currentTrack.info.title?.substr(0,40)}](${Messages.Links.SupportLink})`)
                    ;
                message.reply({
                    embeds: [sucessEmbed]
                })
            } else {
                message.reply({
                    embeds: [rejectEmbed]
                })
            }

        } catch (e) {
            Logger.log(e, "Error")
        }
    }
}
