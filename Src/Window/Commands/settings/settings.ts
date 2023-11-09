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
        name: 'settings',
        userPerms: ['ManageGuild'],
        description: "Display's Guild Settings enabled/disabled",
        vote: false,
        voice: false,
        queue: false,
        player: false,
        samevc: false,
        botconnection: false,
        aliases: ["settings"],
        permissions: ['SendMessages', 'EmbedLinks'],
        slash: true,
        SlashData: {
            Name: 'settings',
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
            const d: PrismaClient = client.prisma;
            let Announce: string;
            let Buttons: boolean;
            let _247: boolean;
            let autoplay: boolean;
            let vol: number;
            let prefix: string = client.config.Dprefix;


            const GuildData = await d.guildData.findFirst({ where: { guildId: message.guild.id } });
            const __247 = await d.twentyFourBySevenData.findFirst({ where: { guildId: message.guild.id } });
            const _P = await d.prefixData.findFirst({ where: { guildId: message.guild.id } });
            const queue = client.queue.get(message.guild.id);
            Announce = GuildData ? GuildData.AnnounceChannel : "0";
            Buttons = GuildData ? GuildData.NpButtons : false;
            autoplay = GuildData ? GuildData.autoplay : false;
            vol = queue ? queue.player.volume : 100;
            _247 = __247 ? __247.status : false;
            _P ? prefix = _P.prefix : client.config.Dprefix;


            const Ec = `<:muzox_on:1166059714291957820> \`Enabled\``; const Ew = `<:muzox_off:1166059530250100757> \`Disabled\``;

            const Embed = new EmbedBuilder()
                .setAuthor({ name: `${client.user.username} Settings`, iconURL: client.user.displayAvatarURL(), url: `${Messages.Links.SupportLink}` })
                .setFooter({ text: `Thanks For Choosing ${Messages.Messages.thanksforchoosingbotname}`, iconURL: client.user.displayAvatarURL() })
                .setThumbnail(message.guild.iconURL())
                .addFields({ name: `**Server Prefix**`, value: `\`\`\`${prefix}\`\`\``, inline: false },
                    { name: `**Announce Channel**`, value: `\`${Announce}\``, inline: false },
                    { name: `**Music Buttons**`, value: `${Buttons ? Ec : Ew}`, inline: false },
                    { name: `**24/7 Mode**`, value: `${_247 ? Ec : Ew}`, inline: false },
                    { name: `**AutoPlay Mode**`, value: `${autoplay ? Ec : Ew}`, inline: false },
                    { name: `**Volume**`, value: `\`${vol}%\``, inline: false },
                )
                .setColor(Messages.Mconfigs.Ucolor);


            message.reply({ embeds: [Embed], ephemeral: false })



        } catch (e) {
            Logger.log(e, "Error")
        }
    }
}
