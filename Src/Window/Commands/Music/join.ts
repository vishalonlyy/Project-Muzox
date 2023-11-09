import { EmbedBuilder, Message } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, EmojisPacket } from '../../../Resources/modules/index.js';
export default <messageCommands>{
    data: {
        name: 'join',
        vote: false,
        description: 'connect your voice channel to start the party',
        type: 1,
        player:false,
        queue:false,
        voice:true, 
        botconnection: false,
        aliases:["j"],
        permissions:['SendMessages'],
        slash: true,
        SlashData: {
            Name: 'join',
            options: []
          },
          Switches : {
            FullErr : true,
            ViewErr : true,
          }

    },
    execute : async(client : Muzox, message:ContextManager, args : string[])=> {
        

        try
        {
            if(message.CheckInteraction){
                await message.setDeffered(false);
            }
            const memberid = message?.author?.id;
            const botid:any = message.guild?.members.me?.id;
            const voiceState = message.guild?.voiceStates.cache.get(memberid as any);
            const bvoiceState = message.guild?.voiceStates.cache.get(botid);
            const guildId: any = message.guild?.id;
            const channelId: any = voiceState?.channelId;
            const node = client.shoukaku.getIdealNode();
            
    
            let player = node.players.get(guildId);
            const queue: any = client.queue.get(guildId);
            const sucessEmbed = new EmbedBuilder()
                .setDescription(Messages.Messages.join + `${voiceState?.channel || 'N/A'}`)
                .setColor(Messages.Mconfigs.color)
            const rejectEmbed = new EmbedBuilder()
                .setDescription(Messages.Error.alreadyJoined + `${voiceState?.channel || 'N/A'}`)
                .setColor(Messages.Mconfigs.Ecolor)
            const rejectforplaying = new EmbedBuilder()
            .setDescription(Messages.Utils.somewhereplaying)
            .setColor(Messages.Mconfigs.Ecolor)

        //Embeds
        

        //Statements 

        if (!player) {
            await client.shoukaku.joinVoiceChannel({
                guildId: message?.guild.id,
                channelId: channelId,
                shardId: message.guild.shardId,
                deaf: true,
            })
            message.reply({
                embeds: [sucessEmbed]
            })
        }
        if (player && !bvoiceState) {
           client.shoukaku.joinVoiceChannel({
                guildId: guildId,
                channelId: channelId,
                shardId: message.guild.shardId,
                deaf: true,
            })
           message.reply({
            embeds:[sucessEmbed]
           })
        }
        if(player && bvoiceState){
            message.reply({
                embeds:[rejectEmbed]
            })
        }

         if (player && bvoiceState && !queue){
            Promise.all([
                client.queue.delete(guildId),
                client.shoukaku.leaveVoiceChannel(guildId),
                
              ]).then(() => { client.shoukaku.joinVoiceChannel({
                guildId: guildId,
                channelId: channelId,
                shardId: message.guild.shardId,
                deaf: true,
            })
                message.reply({
                    embeds: [sucessEmbed]
                })
            }).catch((error) => {
                console.error(error);
              });
            } 
        if(player && bvoiceState && queue){
            message.reply({
                embeds:[rejectforplaying]
            }).then(()=> message)
        } 
           
            
        
    } catch(e){
        Logger.log(e,"Error")
    }
    }
}
