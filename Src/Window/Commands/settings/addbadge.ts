import { EmbedBuilder, Message, User } from "discord.js";
import Muzox from "../../../Structures/Muzox_Client.js";
import { messageCommands } from "../../../Interfaces/Interfaces.js";
import { PremiumUser, PrismaClient } from '@prisma/client'
import Messages from "../../../Display/Messages/Messages.js";
import Logger from "../../../Resources/Console/MuzoxConsole.js";
import ContextManager from "../../../Structures/Manager/CTX.js";
export default <messageCommands>{
    data: {
        name: 'updatebadge',
        vote: false,
        description: "Add Badge to an user",
        voice: false,
        queue: false,
        player: false,
        samevc: false,
        dev: true,
        botconnection: false,
        aliases: ["ubadge", "updatebadges"],
        permissions: ['SendMessages', 'EmbedLinks'],
        slash: true,
        SlashData: {
            Name: 'userpremium',
            options: []
        },
    },
    execute: async (client: Muzox, message: ContextManager, args: string[]) => {
        //console.log("Trying to update badge")
        try {
            if (message.CheckInteraction) await message.setDeffered(false);
            const NouserMentioned = new EmbedBuilder()
                .setTitle(`User Premium`)
                .setDescription(`No user mentioned`)
                .setColor(Messages.Mconfigs.Ucolor)
                .setTimestamp();
            const userMention = message.mentionedUsers;
            let mentionedUser;
            if (userMention) {
                mentionedUser = userMention.id;
            } else {
                const x = args[1]
                mentionedUser = x //client.users.fetch(x).then((user: User) => user.id).catch(() => null);
            }
            if (!mentionedUser || mentionedUser === undefined || null) return message.reply({ embeds: [NouserMentioned] }).catch(e => Logger.log(e, "Error"))
            let value2 = args[1];
            let value3: any = args[2];
            if (value2 === mentionedUser) {
                value2 = args[0]
                // value3 = args[1]
            } else if (value2.includes("<@")) {
                value2 = args[0]
                // value3 = args[1]
            }
            const AddedPremium = new EmbedBuilder()
                .setTitle(`Badge Updated`)
                .setDescription(`User Profile Updated : Added Badge:` + `\`${value3}\``)
                .setColor(Messages.Mconfigs.Ucolor)
                .setTimestamp();
            const RemovedPremium = new EmbedBuilder()
                .setTitle(`User Updated`)
                .setDescription(`User Profile Updated : Removed Badge` + `\`${value3}\``)
                .setColor(Messages.Mconfigs.Ucolor)
                .setTimestamp();
            const AddedAlready = new EmbedBuilder()
                .setTitle(`Badge Already Exists`)
                .setDescription(`Badge \`${value3}\` Already Added `)
                .setColor(Messages.Mconfigs.Ucolor)
                .setTimestamp();
            const DosntExist = new EmbedBuilder()
                .setTitle(`Badge Dosnt Exists`)
                .setDescription(`Badge \`${value3}\` Dosnt Exists on users profile `)
                .setColor(Messages.Mconfigs.Ucolor)
                .setTimestamp();
            const p = client.prisma.user
            const alreadyExistsCheck = await p.findUnique({
                where: {
                    userId: mentionedUser
                }
            })
            if (!alreadyExistsCheck) {
                await p.create({
                    data: {
                        userId: mentionedUser,
                        Badges: [value3]
                    }
                }).then(() => {
                    message.reply({ embeds: [AddedPremium] }).catch(e => Logger.log(e, "Error"))
                })
            }
            const AvalibleBadges = ['Developer', 'Owner', 'Admin', 'Staff', 'Vip', 'Friend', 'Premium']
            const AvalibleBadgesEmbed = new EmbedBuilder()
                .setTitle(`Avalible Badges`)
                .setDescription(`\`${AvalibleBadges.join('`, `')}\``)
                .setColor(Messages.Mconfigs.Ucolor)
                .setTimestamp();
            if (!AvalibleBadges.includes(value3)) {
                return message.reply({ embeds: [AvalibleBadgesEmbed] }).catch(e => Logger.log(e, "Error"))
            } else {
                if (value2 === 'add') {
                    if (mentionedUser) {
                        if (alreadyExistsCheck && value3) {
                            const y = alreadyExistsCheck.Badges
                            if (y.includes(value3)) return message.reply({ embeds: [AddedAlready] }).catch(e => Logger.log(e, "Error"))
                            else {
                                await client.prisma.user.update({
                                    where: {
                                        userId: mentionedUser
                                    },
                                    data: {
                                        Badges: {
                                            push: value3
                                        }
                                    }
                                }).then(() => {
                                    message.reply({ embeds: [AddedPremium] }).catch(e => Logger.log(e, "Error"))
                                }
                                )
                            }
                        }

                    }
                } else if (value2 === 'remove') {
                    const y = alreadyExistsCheck.Badges
                    if (!y.includes(value3)) return message.reply({ embeds: [DosntExist] }).catch(e => Logger.log(e, "Error"))
                    if (mentionedUser) {
                        if (alreadyExistsCheck && value3) {
                            const newArray = [...alreadyExistsCheck.Badges];
                            const i : number | string  = newArray.indexOf(value3);

                            if (i !== -1) {
                                newArray.splice(i, 1);
                            }
                            //const x: any = alreadyExistsCheck.Badges.filter((value3) => value3 !== value3);
                            await client.prisma.user.update({
                                where: {
                                    userId: mentionedUser
                                },
                                data: {
                                    Badges: newArray
                                }
                            }).then(() => {
                                message.reply({ embeds: [RemovedPremium] }).catch(e => Logger.log(e, "Error"))
                            })
                        }
                    }
                }
            }
        } catch (e) {
        }
    }
}
