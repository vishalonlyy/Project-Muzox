import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder, Message } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, EmojisPacket } from '../../../Resources/modules/index.js';

export default<messageCommands> {
    data: {
        name: 'vote',
        description: 'support the bot by voting it',
        vote: false,
        permissions:['EmbedLinks','SendMessages'],
        slash: true,
        SlashData: {
            Name: 'vote',
            options: []
          },
        
    },
    
    execute : async(client : Muzox, message:ContextManager, args:string[])=> {   
        try{
            if(message.CheckInteraction){
                await message.setDeffered(false);
            }
        const Vote_Button = new ButtonBuilder()
			.setLabel('Vote me')
            .setURL(Messages.Links.VoteLink)
			.setStyle(ButtonStyle.Link);
        const sucessEmbed = new EmbedBuilder()
            .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
            .setDescription(`[Vote Me!?](${Messages.Links.VoteLink})`)
            .setColor(Messages.Mconfigs.Ucolor)
            
        const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(Vote_Button)
        await message.reply({
            embeds:[sucessEmbed],
            components:[row]
            
        });
    } catch(e){
        Logger.log(e,"Error")
    }

    }
} 
