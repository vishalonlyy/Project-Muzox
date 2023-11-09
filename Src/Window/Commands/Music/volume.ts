import { ApplicationCommandOptionType, EmbedBuilder, Message } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, EmojisPacket } from '../../../Resources/modules/index.js';


export default <messageCommands>{
    data: {
        name: 'volume',
        description: 'increase / decrease the volume of the player',
        voice: true,
        queue: true,
        player: true,
        samevc: true,
        botconnection: true,
        aliases: ["v"],
        permissions: ['EmbedLinks', 'SendMessages', 'Connect'],
        slash: true,
        vote: true,
        SlashData: {
            Name: 'volume',
            options: [
                {
                    name: 'level',
                    description: 'volume to set',
                    type: ApplicationCommandOptionType.Number,
                    required: true
                },
            ],
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

            const queue: any = client.queue.get(guildId);
            const ctx = new ContextManager(message, args);
            let player = node.players.get(guildId);
            // console.log(player.volume)
            
            let volume: any ;
            volume = await ctx.Options('volume');
            //Embeds
            const rejectEmbed = new EmbedBuilder()
                .setDescription('Please switch the volume b/w **1 - 500**')
                .setColor(Messages.Mconfigs.Ecolor)
            const rejectValidNumberEmbed = new EmbedBuilder()
                .setDescription(`Provided % wasn\'t a valid number : \`${volume}\``)
                .setColor(Messages.Mconfigs.Ecolor)
            
            //Statements 

            if (player && volume > 500) {
                message.reply({
                    embeds: [rejectEmbed]
                })
                return;
            }
            if (player && volume < 1) {
                message.reply({
                    embeds: [rejectEmbed]
                })
                return;
            }
            if (player && memberVoiceChannel === botVoiceChannel) {
                //Embeds
                const sucessEmbed = new EmbedBuilder()
                    .setDescription(`Volume switched to **${volume}%**`)
                    .setColor(Messages.Mconfigs.color)
                player.setGlobalVolume(volume )
                message.reply({
                    embeds: [sucessEmbed]
                }).catch(e => console.log(e))
            }
        } catch (e) {
            Logger.log(e,"Error")
        }
    }
}
