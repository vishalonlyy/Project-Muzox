import { EmbedBuilder, Message } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, EmojisPacket } from '../../../Resources/modules/index.js';

export default <messageCommands>{
    data: {
        name: 'leave',
        description: 'disconnect from voice channel ',
        vote: false,
        type: 1,
        voice: false,
        samevc: false,
        queue: false,
        player: true,
        aliases: ["disconnect", "dc"],
        permissions: ['EmbedLinks', 'SendMessages'],
        slash: true,
        SlashData: {
            Name: 'leave',
            options: []
          },
          


    },
    execute: async (client: Muzox, message: ContextManager, args:string[]) => {


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
            const node = client.shoukaku.getIdealNode();


            let player = node.players.get(guildId);
            const queue = client.queue.get(guildId);

            //Embeds
            const sucessEmbed = new EmbedBuilder()
                .setDescription(Messages.Messages.leave + ``)
                .setColor(Messages.Mconfigs.color)
            const rejectEmbed = new EmbedBuilder()
                .setDescription(Messages.Error.alreadyDisconnected)
                .setColor(Messages.Mconfigs.Ecolor)
            const rejectSameVC = new EmbedBuilder()
                .setDescription(Messages.Error.notsameVC)
                .setColor(Messages.Mconfigs.Ecolor)

            //Statements 


            if (player && !bvoiceState) {
                message.reply({
                    embeds: [rejectEmbed]
                })
            }

            if(queue?.playing === false && memberVoiceChannel !== botVoiceChannel){
                Promise.all([
                    client.queue.delete(guildId),
                    client.shoukaku.leaveVoiceChannel(guildId),
                    player.destroyPlayer()
                ]).then(() => {
                    message.react('👋')
                    // message.reply({
                    //     embeds: [sucessEmbed]
                    // })
                }).catch((error) => {
                    console.error(error);
                });
            }
            if (player && memberVoiceChannel === botVoiceChannel) {
                Promise.all([
                    client.queue.delete(guildId),
                    client.shoukaku.leaveVoiceChannel(guildId),
                    player.destroyPlayer()
                ]).then(() => {
                    message.react('👋')
                    // message.reply({
                    //     embeds: [sucessEmbed]
                    // })
                }).catch((error) => {
                    console.error(error);
                });
            }

            // if (player && memberVoiceChannel !== botVoiceChannel) {
            //     message.reply({
            //         embeds: [rejectSameVC]
            //     })
            // }

        } catch (e) {
            Logger.log(e,"Error")
        }
    }
}
