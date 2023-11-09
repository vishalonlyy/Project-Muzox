import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, EmojisPacket } from '../../../Resources/modules/index.js';

export default<messageCommands> {
    data: {
        name: 'invite',
        description: "invite the bot to your server",
        vote: false,
        aliases:['add','addbot'],
        permissions:['EmbedLinks','SendMessages'],
        slash: true,
        SlashData: {
            Name: 'invite',
            options: []
          },
        
    },
    
    execute : async(client : Muzox, message:ContextManager, args:string[])=> {   
        try{
            if(message.CheckInteraction){
                await message.setDeffered(false);
            }
        
        const Vote_Button = new ButtonBuilder()
			.setLabel('Add me')
            .setURL(Messages.Links.InviteLink)
			.setStyle(ButtonStyle.Link);
        const sucessEmbed = new EmbedBuilder()
            .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
            .setDescription(`[Add Me?](${Messages.Links.InviteLink})`)
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
