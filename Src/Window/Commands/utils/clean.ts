import { ApplicationCommandOptionType, Channel, EmbedBuilder, GuildBasedChannel, GuildTextBasedChannel, GuildTextBasedChannelTypes, Message, Snowflake, SnowflakeUtil, TextChannel } from "discord.js";
import Muzox from "../../../Structures/Muzox_Client.js";
import { messageCommands } from "../../../Interfaces/Interfaces.js";
import { PrismaClient } from '@prisma/client'
import Messages from "../../../Display/Messages/Messages.js";
import Logger from "../../../Resources/Console/MuzoxConsole.js";
import ContextManager from "../../../Structures/Manager/CTX.js";
import { EmojisPacket } from "../../../Resources/modules/index.js";
export default <messageCommands>{
    data: {
        name: 'clean',
        description: 'Clean the channel from bot messages sent previously',
        vote: false,
        voice: false,
        queue: false,
        player: false,
        samevc: false,
        botconnection: false,
        aliases: ["clean", "cleanmessages"],
        permissions: ['SendMessages', 'EmbedLinks'],
        userPerms: ['ManageGuild'],
        slash: true,
        SlashData: {
            Name: 'clean',
            options: [
                {
                    name: 'channel',
                    description: 'The channel to clean',
                    type: ApplicationCommandOptionType.Channel,
                    required: false
                }
            ]
          },
    },
    execute: async (client: Muzox, message: ContextManager, args: string[]) => {
        try {
            if(message.CheckInteraction){
                await message.setDeffered(false);
            }

            let PChannel: string = await message.Options("channel", true);
            if(PChannel === undefined || PChannel === null){
                PChannel = message.channel.id;
            }
            const currentD = new Date();
            const _14_D:Date = new Date(currentD.getTime() - (14 * 24 * 60 * 60 * 1000));
            // const snowfalkes:any = SnowflakeUtil.generate(_14_D.getTime());
            const channel: TextChannel | undefined = message.guild.channels.cache.get(PChannel) as TextChannel || message.guild.channels.cache.find((c) => c.name.toLowerCase().includes(PChannel.toLowerCase())) as TextChannel;
            const messages = await channel.messages.fetch({ limit: 100, cache:true  },);
            const filtered = messages.filter((m:Message) => m.author.id === client.user?.id);
            const DateFiltered = filtered.filter((m:Message) => m.createdTimestamp > _14_D.getTime());
            await channel.bulkDelete(DateFiltered).then(async()=>{
                await message.send({embeds: [new EmbedBuilder().setAuthor({name:`${client.user.username}`, iconURL: client.user.displayAvatarURL(), url:`${Messages.Links.InviteLink}` }).setColor(Messages.Mconfigs.Ucolor).setDescription(`Deleted \`${filtered.size}\` ${client.user.username}'s messages from ${channel}`)]}).then(async (msg)=>{
                    setTimeout(async () => {
                    await msg.delete().catch(()=>{});
                    },5000)
                })
            })
        } catch (e) {
            Logger.log(e,"Error")
        }
    }
}
