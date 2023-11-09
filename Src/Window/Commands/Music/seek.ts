import { ApplicationCommandOptionType, EmbedBuilder, Message } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, formatTime } from '../../../Resources/modules/index.js';
import parseTime from '../../../Display/Utils/parsetime.js';


export default <messageCommands>{
    data: {
        name: 'seek',
        description: 'seek the current playing track/song',
        vote: false,
        voice: true,
        queue: true,
        player: true,
        botconnection: true,
        permissions: ['EmbedLinks', 'SendMessages'],
        slash: true,
        SlashData: {
            Name: 'seek',
            options: [
                {
                    name: 'time',
                    description: 'time to seek. Ex: 1s, 1m, 1h, 1d ',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                }
            ]
          },
    },
    execute: async (client: Muzox, message: ContextManager, args: string[]) => {
        try {
            let time: any;
            if(message.CheckInteraction){
                message.setDeffered(false);
                time = await message.Options('time')
            } else {
                time = args[0]
            }
            const FinalTime = await parseTime(time);
            if(time){
                
                const queue = await client.queue.get(message.guild?.id);
                await queue?.seek(FinalTime)
                const Sucess = new EmbedBuilder()
                .setDescription(`Sucessfully Seeked to \`${time}/${formatTime(queue?.currentTrack?.info?.length)}\``)
                .setColor(Messages.Mconfigs.Ucolor)
                
                return message.reply({embeds: [Sucess]})
            } else {
                const Error = new EmbedBuilder()
                .setDescription(`There was an error while seeking to \`${time}\`.Contact support if this error persists [Join Support](${Messages.Links.SupportLink})`)
                .setColor(Messages.Mconfigs.Ecolor)
                return message.reply({embeds: [Error]})

            }

            
            

        } catch (e) {
           // Logger.log(e,"Error")
        }
    }
}
