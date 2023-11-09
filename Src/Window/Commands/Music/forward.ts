import { ApplicationCommandOptionType, EmbedBuilder, Message } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, formatTime } from '../../../Resources/modules/index.js';
import parseTime from '../../../Display/Utils/parsetime.js';


export default <messageCommands>{
    data: {
        name: 'forward',
        description: 'seek the current playing track/song',
        voice: true,
        vote: false,
        queue: true,
        player: true,
        botconnection: true,
        permissions: ['EmbedLinks', 'SendMessages'],
        slash: true,
        SlashData: {
            Name: 'forward',
            options: [{
                name: 'time',
                description: 'time to forward to',
                type: ApplicationCommandOptionType.String,
                required: true
            }]
        },

    },
    execute: async (client: Muzox, message: ContextManager, args: string[]) => {
        try {
            let time: any;
            if (message.CheckInteraction) {
                message.setDeffered(false);
                const y = message.Options('time');
                if (y) {
                    time = y
                } else {
                    time = '10s'
                }

                // time = message.Options?('time') : time = '10s'
            } else {
                let y = args[0];
                if (y) {
                    time = y
                }
                else {
                    time = '10s'
                }
            }
            // const FinalTime = await parseTime(time);
            if (time) {

                const queue = await client.queue.get(message.guild?.id);
                await queue?.forward(time)
                const Sucess = new EmbedBuilder()
                    .setDescription(`Sucessfully forwarded to \`${time}/${formatTime(queue?.currentTrack?.info?.length)}\``)
                    .setColor(Messages.Mconfigs.Ucolor)

                return message.reply({ embeds: [Sucess] })
            } else {
                const Error = new EmbedBuilder()
                    .setDescription(`There was an error while seeking to \`${time}\`.Contact support if this error persists [Join Support](${Messages.Links.SupportLink})`)
                    .setColor(Messages.Mconfigs.Ecolor)
                return message.reply({ embeds: [Error] })

            }




        } catch (e) {
            // Logger.log(e,"Error")
        }
    }
}
