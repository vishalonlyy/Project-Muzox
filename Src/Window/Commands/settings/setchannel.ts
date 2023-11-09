import { ApplicationCommandOptionType, EmbedBuilder, Message } from "discord.js";
import Muzox from "../../../Structures/Muzox_Client.js";
import { messageCommands } from "../../../Interfaces/Interfaces.js";
import { PrismaClient } from '@prisma/client'
import Messages from "../../../Display/Messages/Messages.js";
import Logger from "../../../Resources/Console/MuzoxConsole.js";
import ContextManager from "../../../Structures/Manager/CTX.js";
import { EmojisPacket } from "../../../Resources/modules/index.js";
export default <messageCommands>{
    data: {
        name: 'setchannel',
        description: 'Set the default channel for the bot to reply/send messages ',
        vote: true,
        voice: false,
        queue: false,
        player: false,
        samevc: false,
        botconnection: false,
        aliases: ["defaultchannel", "dchannel"],
        permissions: ['SendMessages', 'EmbedLinks'],
        userPerms: ['ManageGuild'],
        slash: true,
        SlashData: {
            Name: 'defaultchannel',
            options: [
                {
                    name: 'channel',
                    description: 'The channel to set as default',
                    type: ApplicationCommandOptionType.Channel,
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

            let PChannel :string = await message.Options("channel", true);
            // if(typeof PChannel === "string" ){
            //     PChannel = parseInt(PChannel);
            // }
            //onsole.log({"0":PChannel})
            // if(PChannel !== Number){
            //     PChannel = PChannel?.id; 
            // } 

            const p = client.prisma.guildData;
            const guildId_ = message.guild.id;
            const data = await p.findFirst({where:{guildId:guildId_}});
            async function checkDataExists(){
                if(!data){
                    await p.create({data:{
                        guildId:guildId_,
                        NpButtons:true,
                        autoplay:false,
                        AnnounceChannel:"0"
                    }}).then(async()=>{return true}).catch((e)=>{return false});
                } else {
                    return true;
                }
            }

          const guildData =  await checkDataExists();

            if(guildData){
                //const channel:number = PChannel; //message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find((c)=>c.name.toLowerCase().includes(args[0].toLowerCase()))
                if(PChannel){
                    await p.update({where:{guildId:guildId_},data:{AnnounceChannel:PChannel }}).then(()=>{
                        const embed = new EmbedBuilder()
                        .setColor(Messages.Mconfigs.Ucolor)
                        .setDescription(`Default Channel has been set to ${PChannel}`)
                        message.reply({embeds:[embed],ephemeral:false}).then((msg)=>{
                            setTimeout(()=>{msg.delete()},5000);
                        })
                    }).catch((e)=>{
                        Logger.log(e,"Error")
                    })
                } else {
                    const embed = new EmbedBuilder()
                    .setColor(Messages.Mconfigs.Ecolor)
                    .setDescription(`Please mention a channel or provide a valid channel ID`)
                    message.reply({embeds:[embed],ephemeral:false}).then((msg)=>{
                        setTimeout(()=>{msg.delete()},5000)
                    })
                }
            } 
        } catch (e) {
            Logger.log(e,"Error")
        }
    }
}
