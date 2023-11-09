import { ApplicationCommandOptionType, EmbedBuilder, Message } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, FindQueue, EmojisPacket } from '../../../Resources/modules/index.js';


export default <messageCommands>{
    data: {
        name: 'removedupes',
        description: 'Remove Duplicate Songs From The Queue',
        vote: false,
        voice: true,
        queue: true,
        player: true,
        botconnection: true,
        permissions: ['EmbedLinks'],
        slash: true,
        SlashData: {
            Name: 'removedupes',
            options: [

            ]
        },
    },
    execute: async (client: Muzox, message: ContextManager, args: string[]) => {



        try {

            if (message.CheckInteraction) {
                await message.setDeffered(false);
            }

            const queue: Queue = await FindQueue(client, message.guild.id, message.ctx || message.message)//client.queue.get(guildId);

            const ErrorEmbed = new EmbedBuilder()
                .setTitle(Messages.Title.Cerror)
                .setColor(Messages.Mconfigs.Ecolor);



            if (queue.player) {
                const removedTracks: Queue['tracks'] = [];
                for (let i = 0; i < queue.tracks.length; i++) {
                    for (let j = i + 1; j < queue.tracks.length; j++) {
                        if (queue.tracks[i].info.title === queue.tracks[j].info.title) {
                            const duplicateTrack = queue.tracks.splice(j, 1)[0];
                            removedTracks.push(duplicateTrack);
                            j--; // Decrement j since the array has shifted after splicing
                        }
                    }
                }
                return message.reply({
                    embeds: [new EmbedBuilder().setDescription(`${message.channel.permissionsFor(client.user).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.correct}` : `☑️`} Removed ${removedTracks.length} Duplicate Songs From The Queue`)
                        .setColor(Messages.Mconfigs.Ucolor)
                    ]
                })
            } else {
                return message.reply({
                    embeds: [ErrorEmbed.setDescription(Messages.Error.Support)]
                })
            }




        } catch (e) {
            //Logger.log(e, "Error")
        }
    }

}
