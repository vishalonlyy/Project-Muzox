import { EmbedBuilder, Message } from "discord.js";
import Muzox from "../../../Structures/Muzox_Client.js";
import { messageCommands } from "../../../Interfaces/Interfaces.js";
import { PrismaClient } from '@prisma/client'
import Messages from "../../../Display/Messages/Messages.js";
import Logger from "../../../Resources/Console/MuzoxConsole.js";
import ContextManager from "../../../Structures/Manager/CTX.js";
import EmojisPacket from "../../../Display/Messages/EmojisPacket.js";
export default <messageCommands>{
    data: {
        name: 'buttons',
        description: 'Toggle the buttons in now playing message.',
        vote: false,
        voice: true,
        queue: false,
        player: false,
        samevc: true,
        botconnection: true,
        aliases: ["songbuttons", "npbuttons"],
        permissions: ['SendMessages', 'EmbedLinks'],
        slash: true,
        SlashData: {
            Name: 'buttons',
            options: []
        },
    },
    execute: async (client: Muzox, message: ContextManager, args: string[]) => {
        try {
            const Db = client.prisma.guildData;
            const Check = await Db.findFirst({
                where: {
                    guildId: message.guild?.id
                }
            })

            // if(!Check){
            //     await Db.create({
            //         data: {
            //             guildId: message.guild?.id,
            //             NpButtons: true
            //         }
            //     })
            // }
            // if(!Check.NpButtons){
            //     await Db.update({
            //         where: {
            //             guildId: message.guild?.id
            //         },
            //         data: {
            //             NpButtons: true
            //         }
            //     })
            // }

            if (Check) {
                if (Check.NpButtons === false) {
                    await Db.update({
                        where: {
                            guildId: message.guild?.id
                        },
                        data: {
                            NpButtons: true
                        }
                    })
                    message.reply({ embeds : [
                        new EmbedBuilder()
                        .setColor(Messages.Mconfigs.color)
                        .setDescription(`${message.channel?.permissionsFor(client.user).has('UseExternalEmojis') ? `${EmojisPacket.Emojis?.correct}` : `${EmojisPacket.Emojis.NormalEmojis?.tick}`} ${Messages.Messages?.NpButtonsEnabled} ${message?.guild.name}`)
                    ], ephemeral: true })
                } else {
                    await Db.update({
                        where: {
                            guildId: message.guild?.id
                        },
                        data: {
                            NpButtons: false
                        }
                    })
                    message.reply({ embeds : [
                        new EmbedBuilder()
                        .setColor(Messages.Mconfigs.color)
                        .setDescription(`${message.channel?.permissionsFor(client.user).has('UseExternalEmojis') ? `${EmojisPacket.Emojis?.Wrong}` : `${EmojisPacket.Emojis.NormalEmojis?.Wrong}`} ${Messages.Messages?.NpButtonsDisabled} ${message?.guild?.name}`)
                    ], ephemeral: true })
                }

            } else {
                await Db.create({
                    data: {
                        guildId: message.guild?.id,
                        NpButtons: true
                    }
                })
                message.reply({ embeds : [
                    new EmbedBuilder()
                    .setColor(Messages.Mconfigs.color)
                    .setDescription(`${message.channel?.permissionsFor(client.user).has('UseExternalEmojis') ? `${EmojisPacket.Emojis?.correct}` : `${EmojisPacket.Emojis.NormalEmojis?.tick}`} ${Messages.Messages?.NpButtonsEnabled} ${message?.guild.name}`)
                ], ephemeral: true })
            }


        } catch (e) {
            Logger.log(e, "Error")
        }
    }
}