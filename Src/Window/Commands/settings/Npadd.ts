import { ApplicationCommandOptionType, EmbedBuilder, Message, SlashCommandBuilder } from "discord.js";
import Muzox from "../../../Structures/Muzox_Client.js";
import { messageCommands } from "../../../Interfaces/Interfaces.js";
import { PremiumUser, PrismaClient } from '@prisma/client'
import Messages from "../../../Display/Messages/Messages.js";
import Logger from "../../../Resources/Console/MuzoxConsole.js";
import ContextManager from "../../../Structures/Manager/CTX.js";

export default <messageCommands>{
    data: {
        name: 'noprefix',
        description: "Add noprefix to User ",
        vote: false,
        voice: false,
        queue: false,
        player: false,
        samevc: false,
        dev: true,

        botconnection: false,
        aliases: ["nop", "nprefix"],
        permissions: ['SendMessages', 'EmbedLinks'],
        slash: true,
        SlashData: {
            Name: 'noprefix',
            options : [
                {
                    name: 'user',
                    description: 'mention/id of user to add noprefix',
                    type: ApplicationCommandOptionType.User,
                    required: true,
                   
                },
                {
                    name: 'action',
                    description: 'add/remove',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        { name: 'add', value: 'add' },
                        { name: 'delete', value: 'remove' },
                      ],
                }
                
            ]
        },
    },
    execute: async (client: Muzox, message: ContextManager, args: string[]) => {

        try {
            let userMention: any;
            let value2: any;
            if (message.CheckInteraction) {
                await message.setDeffered(false);
                userMention = await message.Options('user')
                const option = await message.Options('action')
                if(option === 'add'){
                    value2 = 'add'
                }else if(option === 'remove'){
                    value2 = 'remove'
                }
            } else {
                userMention = await message.GetUsers(null, 1);
                value2 = args[0];
            }

            const NouserMentioned = new EmbedBuilder()
                .setTitle(`User Update`)
                .setDescription(`No user mentioned`)
                .setColor(Messages.Mconfigs.Ucolor)
                .setTimestamp();
            const AlreadyActionTaken = new EmbedBuilder()
                .setTitle(`User Update`)
                .setColor(Messages.Mconfigs.Ucolor)
                .setTimestamp();


            
            let mentionedUser;
            mentionedUser = userMention;

            if (!userMention || userMention === null || !mentionedUser || mentionedUser === undefined || null) {
                message.reply({ embeds: [NouserMentioned] }).catch(e => Logger.log(e, "Error"));
            }




            const AddedPremium = new EmbedBuilder()
                .setTitle(`User Updated`)
                .setDescription(`User sucessfully installed in noprefix system :` + `\`${mentionedUser}\``)
                .setColor(Messages.Mconfigs.Ucolor)
                .setTimestamp();
            const RemovedPremium = new EmbedBuilder()
                .setTitle(`User Updated`)
                .setDescription(`User deleted from noprefix system :` + `\`${mentionedUser}\``)
                .setColor(Messages.Mconfigs.Ucolor)
                .setTimestamp();

            const RunningPremium = new EmbedBuilder()
                .setTitle(`User Updated`)
                .setColor(Messages.Mconfigs.Ucolor)
                .setTimestamp();

            const p = client.prisma.noprefix
            const alreadyExistsCheck = await p.findFirst({
                where: {
                    userId: mentionedUser
                }
            })

            if (value2 === 'add') {
                if (mentionedUser) {
                    if (alreadyExistsCheck && alreadyExistsCheck.active === true) {
                        message.reply({ embeds: [RunningPremium.setDescription(`User is already running on noprefix system :: \`${alreadyExistsCheck.active}\``)] }).catch(e => Logger.log(e, "Error"))
                    } else if (alreadyExistsCheck && alreadyExistsCheck.active === false) {
                        await p.update({
                            where: { userId: mentionedUser },
                            data: {
                                active: true,
                            }
                        })
                        message.reply({ embeds: [RunningPremium.setDescription(`Updated user nprefix system :: Re-Installed, active : true`)] }).catch(e => Logger.log(e, "Error"))
                    } else {
                        await p.create({
                            data: {
                                userId: mentionedUser,
                                active: true,

                            }
                        })
                        message.reply({ embeds: [AddedPremium] }).catch(e => Logger.log(e, "Error"))
                    }
                } else {
                    return message.reply({ embeds: [NouserMentioned] }).catch(e => Logger.log(e, "Error"))

                }
            } else if (value2 === 'remove') {
                if (mentionedUser) {
                    const p = client.prisma.noprefix
                    const alreadyExistsCheck = await p.findFirst({
                        where: {
                            userId: mentionedUser
                        }
                    })
                    if (alreadyExistsCheck) {
                        await p.deleteMany({
                            where: {
                                userId: mentionedUser
                            }
                        })
                        message.reply({ embeds: [RemovedPremium] }).catch(e => Logger.log(e, "Error"))
                    } else {
                        message.reply({
                            embeds: [
                                AlreadyActionTaken.setDescription(`User is not running on noprefix system :: \`${mentionedUser}\``)]
                        }).catch(e => Logger.log(e, "Error"))

                    }

                } else {
                    return message.reply({ embeds: [NouserMentioned] }).catch(e => Logger.log(e, "Error"))

                }
            }


        } catch (e) {
            // Logger.log(e, "Error")
        }
    }


}
