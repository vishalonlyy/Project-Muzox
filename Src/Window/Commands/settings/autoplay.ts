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
        name: 'autoplay',
        description: 'Enable/Disable autoplay mode of the server',
        vote: false,
        voice: true,
        queue: false,
        player: false,
        samevc: true,
        botconnection: true,
        aliases: [],
        permissions: ['SendMessages', 'EmbedLinks'],
        slash: true,
        SlashData: {
            Name: 'autoplay',
            options: []
          },
    },
    execute: async (client: Muzox, message: ContextManager, args: string[]) => {
        try {
            if(message.CheckInteraction){
                await message.setDeffered(false);
            }
            const memberid = message?.author?.id;
            const voiceState = message.guild?.voiceStates.cache.get(memberid)?.channel?.id ?? '0';
            const p = client.prisma.guildData;
            const guildId_ = message.guild.id;
               const alreadyExists = await p.findFirst({
                where: {
                    guildId: guildId_
                }
            })
            if (alreadyExists) {
                if(alreadyExists.autoplay === false ){
                    const ActiveEmbed = new EmbedBuilder()
                    .setDescription(`${message.channel.permissionsFor(client.user).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.correct}` : `${EmojisPacket.Emojis.NormalEmojis.tick}`} ${Messages.Messages.EnabledAutoPlay} in ${message.guild?.name}`)
                    .setColor(Messages.Mconfigs.Ucolor)
                    ;
                    await p.update({
                        where: {
                            guildId: guildId_
                        },
                        data: {
                             autoplay: true,
                            }
                            
                    }).then(() =>{
                        ActiveEmbed.setDescription(`${message.channel.permissionsFor(client.user).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.correct}` : `${EmojisPacket.Emojis.NormalEmojis.tick}`} ${Messages.Messages.EnabledAutoPlay} in ${message.guild?.name}`);
                        message.reply({ embeds: [ActiveEmbed] })
                        }).catch(e => Logger.log(e, "Error"))
                   
                } else {
                    const ActiveEmbed = new EmbedBuilder()
                    .setDescription(`${message.channel.permissionsFor(client.user).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.correct}` : `${EmojisPacket.Emojis.NormalEmojis.tick}`} ${Messages.Messages.EnabledAutoPlay} in ${message.guild?.name}`)
                    .setColor(Messages.Mconfigs.Ucolor)
                    ;
                    await p.update({
                        where :{
                            guildId : guildId_
                        },
                        data:{
                            autoplay: false,
                        }
                    }).then(() => {
                        ActiveEmbed.setDescription(`${message.channel.permissionsFor(client.user).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.Wrong}` : `${EmojisPacket.Emojis.NormalEmojis.Wrong}`} ${Messages.Messages.DisabledAutoPlay} in ${message.guild?.name}`);
                        message.reply({ embeds: [ActiveEmbed] })
                    }).catch(e => Logger.log(e, "Error"))
              
                }
            } else {
                const ActiveEmbed = new EmbedBuilder()
                .setDescription(`${message.channel.permissionsFor(client.user).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.correct}` : `${EmojisPacket.Emojis.NormalEmojis.tick}`} ${Messages.Messages.EnabledAutoPlay} in ${message.guild?.name}`)
                .setColor(Messages.Mconfigs.Ucolor)
                ;
                await p.create({
                    data: {
                        guildId: guildId_,
                        autoplay: true,
                    }
                
               //message.reply({ embeds: [ActiveEmbed] }
                }).then(() => message.reply({ embeds: [ActiveEmbed] })).catch(e => Logger.log(e, "Error"))
               
            }

        } catch (e) {
            Logger.log(e,"Error")
        }
    }
}
