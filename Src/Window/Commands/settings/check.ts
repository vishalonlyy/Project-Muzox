import { EmbedBuilder, Message } from "discord.js";
import Muzox from "../../../Structures/Muzox_Client.js";
import { messageCommands } from "../../../Interfaces/Interfaces.js";
import { PrismaClient } from '@prisma/client'
import Messages from "../../../Display/Messages/Messages.js";
import Logger from "../../../Resources/Console/MuzoxConsole.js";
import ContextManager from "../../../Structures/Manager/CTX.js";
import Queue from "../../../Structures/Queue.js";
export default <messageCommands>{
    data: {
        name: 'check',
        description: "Check if the 247 feature is active",
        vote: false,
        voice: false,
        queue: false,
        player: false,
        samevc: false,
        botconnection: false,
        aliases: ["check"],
        permissions: ['SendMessages', 'EmbedLinks'],
        slash: true,
        SlashData: {
            Name: 'check',
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
            const p = client.prisma.twentyFourBySevenData
            const queue : Queue = client.queue.get(message.guild?.id)
            if(queue){
                message.reply(`${queue.playing}`)
            } else {
                queue.playing = true;
                message.reply('No queue')
            }
            // const alreadyExists = await p.findUnique({
            //     where: {
            //         guildId: message?.guild?.id
            //     }
            // })
            // if(alreadyExists){
            //     const ActiveEmbed = new EmbedBuilder()
            //     .setDescription(`\`\`\`ts\n${JSON.stringify(alreadyExists)}\`\`\``)
            //     .setColor(Messages.Mconfigs.Ucolor)
            //     .setTimestamp();
            //     await message.reply({ embeds: [ActiveEmbed] })
            // }



        } catch (e) {
            Logger.log(e,"Error")
        }
    }
}
