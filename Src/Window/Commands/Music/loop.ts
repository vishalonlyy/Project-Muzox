import { ApplicationCommandOptionType, EmbedBuilder, Message } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, formatTime, EmojisPacket } from '../../../Resources/modules/index.js';
import parseTime from '../../../Display/Utils/parsetime.js';


export default <messageCommands>{
    data: {
        name: 'loop',
        description: 'loop the current playing track/song',
        voice: true,
        vote: false,
        queue: true,
        player: true,
        botconnection: true,
        permissions: ['EmbedLinks', 'SendMessages'],
        slash: true,
        SlashData: {
            Name: 'loop',
            options: []
        },

    },
    execute: async (client: Muzox, message: ContextManager, args: string[]) => {
        try {
            // let time: any;
            if (message.CheckInteraction) {
                message.setDeffered(false);
            } else {
            }
            // const FinalTime = await parseTime(time);
            // if(time){

            const queue = await client.queue.get(message.guild?.id);
            let x: any = await queue?.loopManager();
            let eod = await x ? 'Track' : 'disabled' ;
            if(eod === 'true'){
                eod = 'Track'
            }
            const Sucess = new EmbedBuilder()
                .setDescription(`${message.channel.permissionsFor(client.user).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.TracKStart.loop}` : `${EmojisPacket.Emojis.NormalEmojis.Loop} ${Messages.Messages.LoopEnabled}`}`)
                .setColor(Messages.Mconfigs.Ucolor)

            return message.reply({ embeds: [Sucess] }).catch(e => {
                const Error = new EmbedBuilder()
                    .setDescription(`${Messages.Error.Support}`)
                    .setColor(Messages.Mconfigs.Ecolor)
                return message.reply({ embeds: [Error] })
            })
            // } else {
            //     const Error = new EmbedBuilder()
            //     .setDescription(`${Messages.Error.Support}`)
            //     .setColor(Messages.Mconfigs.Ecolor)
            //     return message.reply({embeds: [Error]})

            // }




        } catch (e) {
            Logger.log(e, "Error")
        }
    }
}
