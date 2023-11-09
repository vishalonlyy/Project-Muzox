import { ApplicationCommandOptionType, EmbedBuilder, Message, User } from "discord.js";
import Muzox from "../../../Structures/Muzox_Client.js";
import { messageCommands } from "../../../Interfaces/Interfaces.js";
import { PrismaClient } from '@prisma/client'
import Messages from "../../../Display/Messages/Messages.js";
import Logger from "../../../Resources/Console/MuzoxConsole.js";
import ContextManager from "../../../Structures/Manager/CTX.js";

export default <messageCommands>{
    data: {
        name: 'prefix',
        userPerms: ['ManageGuild'],
        description: "Set a custom prefix for the bot",
        vote: false,
        voice: false,
        queue: false,
        player: false,
        samevc: false,
        botconnection: false,
        aliases: ["setprefix"],
        permissions: ['SendMessages', 'EmbedLinks'],
        slash: true,
        SlashData: {
            Name: 'prefix',
            options: [
                {
                    name: 'value',
                    description: 'The prefix you want to set',
                    type: ApplicationCommandOptionType.String,
                    required: true

                }
            ]
          },
    },
    execute: async (client: Muzox, message: ContextManager, args: string[]) => {
        try {
            if(message.CheckInteraction){
                await message.setDeffered(false);
            }
            const x = message.author.id;
            const y: User = await client.users.fetch(x);
            const zz = new EmbedBuilder()
                .setDescription(Messages.Error.permission + ':: \`Manage Guild\`')
                .setColor(Messages.Mconfigs.Ecolor)
            if(!message.guild.members.fetch(message.author.id).then((member) => member.permissions.has('ManageGuild'))){
                return message.reply({
                    embeds: [
                       zz
                    ]
                })
            }
            const value : string | any = await message.Options('value')
            //const value = args[0]
            const p = client.prisma.prefixData
            const alreadyExists = await p.findUnique({
                where: {
                    guildId: message?.guild?.id
                }
            })
            const sucessEmbed = new EmbedBuilder()
                .setDescription(Messages.Messages.prefix + `\`${value}\``)
                .setColor(Messages.Mconfigs.Ucolor)


            if (alreadyExists) {
                await p.update({
                    where: {
                        guildId: message?.guild?.id
                    },
                    data: { prefix: value }
                }).then(() => message.reply({ embeds: [sucessEmbed] })).catch(e => Logger.log(e, "Error"))
            } else {
                await p.create({
                    data: { guildId:  message?.guild?.id, prefix: value }
                }).then(() => message.reply({ embeds: [sucessEmbed] })).catch(e => Logger.log(e, "Error"))
            }
        } catch (e) {
            Logger.log(e,"Error")
        }
    }


}
