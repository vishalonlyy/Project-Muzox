import { ApplicationCommandOptionType, EmbedBuilder, Message } from "discord.js";
import Muzox from "../../../Structures/Muzox_Client.js";
import { messageCommands } from "../../../Interfaces/Interfaces.js";
import { PremiumUser, PrismaClient } from '@prisma/client'
import Messages from "../../../Display/Messages/Messages.js";
import Logger from "../../../Resources/Console/MuzoxConsole.js";
import ContextManager from "../../../Structures/Manager/CTX.js";

export default <messageCommands>{
    data: {
        name: 'userpremium',
        description: "Add User premium",
        vote: false,
        voice: false,
        queue: false,
        player: false,
        samevc: false,
        dev: true,

        botconnection: false,
        aliases: ["upremium", "userPremium", "userp", "userP"],
        permissions: ['SendMessages', 'EmbedLinks'],
        slash: true,
        SlashData: {
            Name: 'userpremium',
            options: [
                {
                    name: 'user',
                    description: 'User to add premium',
                    type: ApplicationCommandOptionType.User,
                    required: true
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
                },
                {
                    name: 'duration',
                    description: 'Duration of the premium',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        { name: 'Weekly', value: 'Weekly' },
                        { name: 'Monthly', value: 'Monthly' },
                        { name: 'Yearly', value: 'Yearly' },
                        { name: 'Lifetime', value: 'Lifetime' },
                    ],
                }
            ]
        },
    },
    execute: async (client: Muzox, message: ContextManager, args: string[]) => {

        try {
            let value2: any;
            let subscriptionDurationInDays: any;
            let expires: any;
            let userMention: any;
            if (message.CheckInteraction) {
                await message.setDeffered(false);
                const option = await message.Options('action');
                const duration = await message.Options('duration');
                switch (duration) {
                    case 'Weekly':
                        subscriptionDurationInDays = 7;
                        break;
                    case 'Monthly':
                        subscriptionDurationInDays = 30;
                        break;
                    case 'Yearly':
                        subscriptionDurationInDays = 365;
                        break;
                    case 'Lifetime':
                        subscriptionDurationInDays = 999;
                        break;
                    default:
                        subscriptionDurationInDays = 30;
                        break;
                }
                if (option === 'add') {
                    value2 = 'add'
                } else if (option === 'remove') {
                    value2 = 'remove'
                }
                userMention = await message.Options('user')
            } else {
                value2 = args[0];
                // console.log(args[0])
                userMention = await message.GetUsers(null, 1);
                subscriptionDurationInDays = args[2];
                // console.log(args + ' ' + subscriptionDurationInDays)
            }
            let mentionedUser;
            //let x_ = userMention;
            mentionedUser = userMention?.split(' ')[0];

            const NouserMentioned = new EmbedBuilder()
                .setTitle(`User Premium`)
                .setDescription(`No user mentioned`)
                .setColor(Messages.Mconfigs.Ucolor)
                .setTimestamp();
            const AlreadyActionTaken = new EmbedBuilder()
                .setTitle(`User Premium`)
                .setColor(Messages.Mconfigs.Ucolor)
                .setTimestamp();
                const AddedPremium = new EmbedBuilder()
                .setTitle(`User Premium`)
                .setDescription(`User Premium added for user:` + `\`${mentionedUser}\``)
                .setColor(Messages.Mconfigs.Ucolor)
                .setTimestamp();
            const RemovedPremium = new EmbedBuilder()
                .setTitle(`User Premium`)
                .setDescription(`User Premium removed for user:` + `\`${mentionedUser}\``)
                .setColor(Messages.Mconfigs.Ucolor)
                .setTimestamp();

            const RunningPremium = new EmbedBuilder()
                .setTitle(`User Premium`)
                .setColor(Messages.Mconfigs.Ucolor)
                .setTimestamp();


            if (!userMention || userMention === null || !mentionedUser || mentionedUser === undefined || null) {
                message.reply({ embeds: [NouserMentioned] }).catch(e => Logger.log(e, "Error"));
            }


            let validS = ['Weekly', 'Monthly', 'Yearly', 'Lifetime']
            // const subscriptionDurationInDays = 30;
            if (!validS.includes(subscriptionDurationInDays)) {
                const Embed = new EmbedBuilder()
                    .setTitle(`Duration Error`)
                    .setDescription(`Invalid Subscription Duration\nValid Durations are :: \`Weekly\`, \`Monthly\`, \`Yearly\`, \`Lifetime\``)
                    .setColor(Messages.Mconfigs.Ucolor)
                    .setTimestamp();
                console.log(subscriptionDurationInDays)
                message.reply({ embeds: [Embed] }).catch(e => Logger.log(e, "Error"))
            } else {
                switch (subscriptionDurationInDays) {
                    case 'Weekly':
                        subscriptionDurationInDays = 7;
                        break;
                    case 'Monthly':
                        subscriptionDurationInDays = 30;
                        break;
                    case 'Yearly':
                        subscriptionDurationInDays = 365;
                        break;
                    case 'Lifetime':
                        subscriptionDurationInDays = 999;
                        break;
                    default:
                        subscriptionDurationInDays = 30;
                        break;
                }
                // console.log('Trying to add premium')
                expires = new Date(Date.now() + subscriptionDurationInDays * 24 * 60 * 60 * 1000).toISOString()


                if (value2 === 'add') {
                    if (mentionedUser) {
                        const p = client.prisma.premiumUser
                        const alreadyExistsCheck = await p.findFirst({
                            where: {
                                userId: mentionedUser
                            }
                        })
                        if (alreadyExistsCheck && alreadyExistsCheck.PremiumExpires > alreadyExistsCheck.PremiumSince) {
                            message.reply({ embeds: [RunningPremium.setDescription(`User is already running on a premium tier Days Left before Expire :: \`${alreadyExistsCheck.PremiumExpires}\``)] }).catch(e => Logger.log(e, "Error"))
                        } else if (alreadyExistsCheck && alreadyExistsCheck.PremiumExpires < alreadyExistsCheck.PremiumSince) {

                            await client.prisma.premiumUser.update({
                                where: {
                                    userId: mentionedUser
                                },
                                data: {

                                    Premium: true,
                                    PremiumSince: new Date().toISOString(),
                                    PremiumExpires: expires,
                                    PremiumType: 'Lifetime',
                                    PremiumSubscriptionCount: alreadyExistsCheck.PremiumSubscriptionCount + 1
                                }
                            })
                            message.reply({ embeds: [RunningPremium.setDescription(`Updated user Premium tier :: Re-Installed premium`)] }).catch(e => Logger.log(e, "Error"))

                        } else {
                            await client.prisma.premiumUser.create({
                                data: {
                                    userId: mentionedUser,
                                    Premium: true,
                                    PremiumSince: new Date().toISOString(),
                                    PremiumExpires: expires,
                                    PremiumType: 'Monthly',
                                    PremiumSubscriptionCount: 1
                                }
                            })
                            message.reply({ embeds: [AddedPremium] }).catch(e => Logger.log(e, "Error"))
                        }
                    } else {
                        //console.log('no user mentioned')
                        message.reply({ embeds: [NouserMentioned] }).catch(e => Logger.log(e, "Error"))

                    }
                } else if (value2 === 'remove') {
                    if (mentionedUser) {
                        const p = client.prisma.premiumUser
                        const alreadyExistsCheck = await p.findFirst({
                            where: {
                                userId: mentionedUser
                            }
                        })
                        if (alreadyExistsCheck) {
                            await client.prisma.premiumUser.deleteMany({
                                where: {
                                    userId: mentionedUser
                                }
                            })
                            message.reply({ embeds: [RemovedPremium] }).catch(e => Logger.log(e, "Error"))
                        } else {
                            message.reply({
                                embeds: [
                                    AlreadyActionTaken.setDescription(`User is not on a premium tier :: \`${mentionedUser}\``)]
                            }).catch(e => Logger.log(e, "Error"))

                        }

                    } else {
                        message.reply({ embeds: [NouserMentioned] }).catch(e => Logger.log(e, "Error"))

                    }
                }
            }




        } catch (e) {
            // Logger.log(e, "Error")
        }
    }


}
