import { ApplicationCommandOptionType, EmbedBuilder, Message } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, FindQueue } from '../../../Resources/modules/index.js';


export default <messageCommands>{
    data: {
        name: 'move',
        description: 'move the position of tracks',
        vote: false,
        voice: true,
        queue: true,
        player: true,
        botconnection: true,
        permissions: ['EmbedLinks'],
        slash: true,
        SlashData: {
            Name: 'move',
            options: [
                {
                    name: 'input',
                    description: 'Enter The Position Of The Song You Want To Change!',
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                },
                {
                    name: 'position',
                    description: 'Enter The Position Where You Want To Move The Song!',
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                },
            ]
        },
        
    },
    execute: async (client: Muzox, message: ContextManager, args: string[]) => {



        try {
            let arg1: any;
            let arg2: any;
            if (message.CheckInteraction) {
                await message.setDeffered(false);
                arg1 = + await message.Options('input')
                arg2 = await message.Options('position')
            } else {
                arg1 = + parseInt(args[0]);
                arg2 = parseInt(args[1]);
            }

            const queue: Queue = await FindQueue(client, message.guild.id, message.ctx || message.message)//client.queue.get(guildId);
            //Embeds
            const CommonEmbed = new EmbedBuilder()
                .setDescription(Messages.Error.AlreadyPaused)
                .setColor(Messages.Mconfigs.Ecolor)
            const ErrorEmbed = new EmbedBuilder()
                .setTitle(Messages.Title.Cerror)
                
                .setColor(Messages.Mconfigs.Ecolor);

            if(!arg1 || !arg2){
                return message.reply({
                    embeds: [ErrorEmbed.setDescription(`Invalid arguments,Please try again\nEx: move \`<position of song>\` \`<position to move>\``)]
                })
            }
            if (queue.player) {
                //let arg1 =+ parseInt(args[0]);
                //let arg2 = parseInt(args[1]);
                const TrackName_Moving = queue?.tracks[arg1]?.info?.title;
                if (isNaN(arg1) || isNaN(arg2)) {
                    return message.reply("Please provide valid numeric positions.");
                }
                if (arg1 < 1 || arg1 > queue.tracks.length || arg2 < 1 || arg2 > queue.tracks.length) {
                    return message.reply({
                        embeds: [ErrorEmbed.setDescription(`Please provide valid numeric positions between \`1 - ${queue.tracks.length - 1}\nNote: Changes can only be applied to queue positions, not the currently playing song.\``)]
                    });
                }

                if (arg1 === arg2) return message.reply({
                    embeds: [ErrorEmbed.setDescription(`The current playing track/song is already in the ${arg2} position`)]
                });
                if (arg2 === 1) {
                    arg2 = 2;
                } else if (arg2 === 0) {

                }
                const trackToMove = queue.tracks.splice(arg1 - 1, 1)[0];
                queue.tracks.splice(arg2 - 1, 0, trackToMove);
                return message.reply({
                    embeds: [CommonEmbed.setDescription(`Moved the track \`${TrackName_Moving}\`'s position from \`${arg1}\` to position \`${arg2 - 1}\``)]
                });
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
