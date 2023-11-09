import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder, Message } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, EmojisPacket } from '../../../Resources/modules/index.js';

export default <messageCommands>{
    data: {
        name: 'support',
        description: 'Get your support rights and report the issues you have',
        vote: false,
        permissions:['EmbedLinks','SendMessages'],
        slash: true,
        SlashData: {
            Name: 'support',
            options: []
          },

    }, execute: async (client: Muzox, message: ContextManager, args: string[]) => {
        try {
            if(message.CheckInteraction){
                await message.setDeffered(false);
            }

            const Vote_Button = new ButtonBuilder()
                .setLabel('support server')
                .setURL(Messages.Links.SupportLink)
                .setStyle(ButtonStyle.Link);
            const sucessEmbed = new EmbedBuilder()
                .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
                .setDescription(`Got any error / bug? get your support rights now and help us too \n [Support server](${Messages.Links.SupportLink})`)
                .setColor(Messages.Mconfigs.Ucolor)
                
            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(Vote_Button)
            await message.reply({
                embeds: [sucessEmbed],
                components: [row]

            });

        } catch (e) {
      
    }
    },
} 
