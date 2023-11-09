import { EmbedBuilder, Message } from "discord.js";
import Muzox from "../../../Structures/Muzox_Client.js";
import { messageCommands } from "../../../Interfaces/Interfaces.js";
import { PrismaClient } from '@prisma/client'
import Messages from "../../../Display/Messages/Messages.js";
import Logger from "../../../Resources/Console/MuzoxConsole.js";
import ContextManager from "../../../Structures/Manager/CTX.js";
import { EmojisPacket } from "../../../Resources/modules/index.js";
export default <messageCommands>{
    data: {
        name: '247',
        description: 'Enable/Disable 24/7 mode of the server',
        vote: false,
        voice: true,
        queue: false,
        player: false,
        samevc: false,
        botconnection: false,
        aliases: ["alwayson", "stay", "24_7", "24/7"],
        permissions: ['SendMessages', 'EmbedLinks'],
        slash: true,
        SlashData: {
            Name: '247',
            options: []
          },
    },
    execute: async (client: Muzox, message: ContextManager, args: string[]) => {
        try {
            if(message.CheckInteraction){
                await message.setDeffered(false);
            }
            const memberid = message?.author?.id;
            let voiceState :string = message.guild?.voiceStates.cache.get(memberid)?.channel?.id ?? '0';
            const p = client.prisma.twentyFourBySevenData;
            const guildId_ = message.guild.id;



            const botid:any = message.guild?.members.me?.id;
            const SvoiceState = message.guild?.voiceStates.cache.get(memberid as any);
            const bvoiceState = message.guild?.voiceStates.cache.get(botid);
            const guildId: any = message.guild?.id;
            const channelId: any = SvoiceState?.channelId;
            const node = client.shoukaku.getIdealNode();
            
    
            let player = node.players.get(guildId);
            const queue: any = client.queue.get(guildId);

            // const sucessEmbed = new EmbedBuilder()
            //     .setDescription(Messages.Messages.join + `${SvoiceState?.channel || 'N/A'}`)
            //     .setColor(Messages.Mconfigs.color)
           
            // const rejectforplaying = new EmbedBuilder()
            // .setDescription(Messages.Utils.somewhereplaying)
            // .setColor(Messages.Mconfigs.Ecolor)



            if (!player) {
                await client.shoukaku.joinVoiceChannel({
                    guildId: message?.guild.id,
                    channelId: channelId,
                    shardId: message.guild.shardId,
                    deaf: true,
                })
                
            } 
            if (player && !bvoiceState) {
               client.shoukaku.joinVoiceChannel({
                    guildId: guildId,
                    channelId: channelId,
                    shardId: message.guild.shardId,
                    deaf: true,
                })
                
            }
            if(player && bvoiceState){
                voiceState = bvoiceState?.channelId
                // message.reply({
                //     embeds:[rejectEmbed]
                // })
            }
    
             if (player && bvoiceState && !queue && bvoiceState?.channelId !== SvoiceState?.channelId){
                Promise.all([
                    client.queue.delete(guildId),
                    client.shoukaku.leaveVoiceChannel(guildId),
                    
                  ]).then(() => { client.shoukaku.joinVoiceChannel({
                    guildId: guildId,
                    channelId: channelId,
                    shardId: message.guild.shardId,
                    deaf: true,
                })
                    // message.reply({
                    //     embeds: [sucessEmbed]
                    // })
                }).catch((error) => {
                    console.error(error);
                  });
                } 
            if(player && bvoiceState && queue){
                voiceState = bvoiceState?.channelId
                // message.reply({
                //     embeds:[rejectforplaying]
                // })
            } 



               const alreadyExists = await p.findFirst({
                where: {
                    guildId: guildId_
                }
            })

            if (alreadyExists) {
                if(alreadyExists.status === false ){
                    const ActiveEmbed = new EmbedBuilder()
                    //.setDescription(Messages.Messages.Active_247 + `\`\`\`Active : ${alreadyExists.status}\`\`\``)
                    .setColor(Messages.Mconfigs.Ucolor)
                    ;
                    await p.update({
                        where: {
                            guildId: guildId_
                        },
                        data: {
                             status: true,
                             channel : voiceState,
                             message : message?.channel?.id
                            }
                            
                    }).then(() =>{
                        ActiveEmbed.setDescription(`${message.channel.permissionsFor(client.user).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.correct}` : `${EmojisPacket.Emojis.NormalEmojis.tick}`} ${Messages.Messages.Active_247} ${message.guild?.name}`);
                        message.reply({ embeds: [ActiveEmbed] })
                        }).catch(e => Logger.log(e, "Error"))
                   
                } else {
                    const ActiveEmbed = new EmbedBuilder()
                    //.setDescription(Messages.Messages.Active_247 + `\`\`\`Active : ${alreadyExists.status}\`\`\``)
                    .setColor(Messages.Mconfigs.Ucolor)
                    ;
                    await p.delete({
                        where :{
                            guildId : guildId_
                        }
                    }).then(() => {
                        ActiveEmbed.setDescription(`${message.channel.permissionsFor(client.user).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.Wrong}` : `${EmojisPacket.Emojis.NormalEmojis.Wrong}`} ${Messages.Messages.DeActivated_247} ${message.guild?.name}`);
                        message.reply({ embeds: [ActiveEmbed] })
                    }).catch(e => Logger.log(e, "Error"))
              
                }
            } else {
                const ActiveEmbed = new EmbedBuilder()
                .setDescription(`${message.channel.permissionsFor(client.user).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.correct}` : `${EmojisPacket.Emojis.NormalEmojis.tick}`} ${Messages.Messages.Active_247} ${message.guild?.name}`)
                .setColor(Messages.Mconfigs.Ucolor)
                ;
                await p.create({
                    data: {
                        guildId: guildId_,
                        status: true,
                        channel : voiceState,
                        message : message.channel.id
                    }
                
               //message.reply({ embeds: [ActiveEmbed] }
                }).then(() => message.reply({ embeds: [ActiveEmbed] })).catch(e => Logger.log(e, "Error"))
               
            }

        } catch (e) {
            Logger.log(e,"Error")
        }
    }
}
