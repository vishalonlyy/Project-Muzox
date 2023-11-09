import { ApplicationCommandOptionType, Embed, EmbedBuilder, Message, User } from "discord.js";
import Muzox from "../../../Structures/Muzox_Client.js";
import { messageCommands } from "../../../Interfaces/Interfaces.js";
import { PrismaClient } from '@prisma/client'
import Messages from "../../../Display/Messages/Messages.js";
import Logger from "../../../Resources/Console/MuzoxConsole.js";
import ContextManager from "../../../Structures/Manager/CTX.js";
import { YesNoButtons } from "../../../Display/GlobalEmbeds/privateButtons.js";
import { time } from "console";
import EmojisPacket from "../../../Display/Messages/EmojisPacket.js";
export default <messageCommands>{
    data: {
        name: 'resetsettings',
        userPerms: ['ManageGuild'],
        description: "Reset Guild Data to default",
        vote: false,
        voice: false,
        queue: false,
        player: false,
        samevc: false,
        botconnection: false,
        aliases: ["resetsettings", "resetdata", "resetguild", "resetserver", "resetall"],
        permissions: ['SendMessages', 'EmbedLinks'],
        slash: true,
        SlashData: {
            Name: 'resetsettings',
            options: [
                /**Not Required */
            ]
        },
    },
    execute: async (client: Muzox, message: ContextManager, args: string[]) => {
        try {
            if (message.CheckInteraction) {
                await message.setDeffered(false);
            }
            const Prisma: PrismaClient = client.prisma;
            // const GuildStatePremium = await Prisma.guildData.findFirst(
            //     { where: { guildId: message.guild?.id } });
            const PremiumGuildData = await Prisma.guildPremium.findFirst(
                { where:{guildId: message.guild?.id}}
            )
            async function DeleteAll_(PremiumGuild?: boolean) {
                if (PremiumGuild) {
                    Promise.all([
                        Prisma.guildData.update({
                            where: { guildId: message.guild?.id }, data: {
                                NpButtons: false,
                                autoplay: false,
                                SearchEngine: 'ytsearch',
                            }
                        }),
                        Prisma.twentyFourBySevenData.delete({ where: { guildId: message.guild?.id } }),
                        Prisma.prefixData.delete({ where: { guildId: message.guild?.id } })
                    ])
                } else {
                    Promise.all([
                        Prisma.guildData.delete({ where: { guildId: message.guild?.id } }),
                        Prisma.guildPremium.delete({ where: { guildId: message.guild?.id } }),
                        Prisma.twentyFourBySevenData.delete({ where: { guildId: message.guild?.id } }),
                        Prisma.prefixData.delete({ where: { guildId: message.guild?.id } })
                    ])
                }
            }
            async function Return(){
                return PremiumGuildData ? PremiumGuildData.Premium : false;
            }
            async function Reset(){
                const z :boolean = await Return();
                await DeleteAll_(z);
                return true;
            }
            let Message: any;let collector: any;
            const AcceptEmbed = new EmbedBuilder()
                .setAuthor({ name: 'Reset Settings', iconURL: client.user?.displayAvatarURL(), url: `${Messages.Links.InviteLink}` })
                .setDescription('Are You Sure That You Want To Reset Your All Bot Settings To Their Default\n\n⚠️ Note:\n> This Action Can\'t Be Undone So Think Wisely\nPress \`Yes\` To Reset Press \`No\` To Cancel')
                .setColor(Messages.Mconfigs.Ucolor)
            await message.reply({ embeds: [AcceptEmbed], components: [YesNoButtons] }).then((m)=>{
                Message = m;
            })
            if (Message) {
                collector = Message.createMessageComponentCollector({
                    time: 30000,
                    filter: (b) => {
                        if (b.user.id !== message.author.id) {
                            try {
                                b.user.reply({ content: 'Only The Command User Can Interact With The Buttons', ephemeral: true })
                            } catch (e) {
                                // Logger.error(e)
                            }
                            return false;
                        } else
                            return true;
                    }, 
                })}

            if(collector){
                collector.on('collect',async(i)=>{
                    let SystemAccepted: "yes"|"no"|"undefined" = "undefined";
                    setTimeout(async()=>{
                        if(SystemAccepted=== "undefined"){
                            await Message.edit({embeds:[new EmbedBuilder().setDescription(`${EmojisPacket.Emojis.correct} Settings Reset Process is Aborted`).setColor(Messages.Mconfigs.Ucolor)],components:[]})
                        }
                    },5000)
                    if(i.customId === 'Yes'){
                        await Reset();
                        SystemAccepted = "yes";
                        await Message.edit({embeds:[new EmbedBuilder().setDescription(`${EmojisPacket.Emojis.correct} All Bot Settings Has Been Reseted To Their Default`).setColor(Messages.Mconfigs.Ucolor)],components:[]})
                        setTimeout(async()=>{
                            await Message.delete();
                        },3000)
                    }
                    if(i.customId === 'No'){
                        await Message.edit({embeds:[new EmbedBuilder().setDescription(`${EmojisPacket.Emojis.correct} Settings Reset Process is Aborted`).setColor(Messages.Mconfigs.Ucolor)],components:[]})
                        SystemAccepted = "no";
                        setTimeout(async()=>{
                            await Message.delete();
                        },3000)
                    }
                })
            }

        } catch (e) {
            Logger.log(e,"Error")
        }
    }
}
