import { EmbedBuilder, Message } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, EmojisPacket } from '../../../Resources/modules/index.js';


export default <messageCommands>{
    data: {
        name: 'shuffle',
        description: 'shuffle the current queue',
        vote: false,
        voice: true,
        queue: true,
        player: true,
        botconnection: true,
        permissions: ['EmbedLinks', 'SendMessages'],
        slash: true,
        SlashData: {
            Name: 'shuffle',
            options: []
          },
    },
    execute: async (client: Muzox, message: ContextManager, args: string[]) => {



        try {
            if(message.CheckInteraction){
                message.setDeffered(false);
            };
            const memberid = message?.author.id;
            const voiceState = message.guild?.voiceStates.cache.get(memberid);
            const guildId: any = message.guild?.id;
            const channelId: any = voiceState?.channelId;
            const node = client.shoukaku.getIdealNode();


            let player = node.players.get(guildId);
            const queue: Queue = client.queue.get(guildId);

            //Embeds
            const ResumeEmbed = new EmbedBuilder()
                .setDescription(Messages.Messages.Shuffled )
                .setColor(Messages.Mconfigs.color)


            //Statements 
            if(!queue.size){
                const NoQueue = new EmbedBuilder()
                    .setDescription(Messages.Error.NoQueue)
                    .setColor(Messages.Mconfigs.Ecolor)
                return message.reply({
                    embeds: [NoQueue]
                })
            } else {
                await queue.shuffleManager(true);
                return message.reply({
                    embeds: [ResumeEmbed]
                })
            }

            
        } catch (e) {
            Logger.log(e,"Error")
        }
    }
}
