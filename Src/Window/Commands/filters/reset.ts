import { CommonEmbed } from '../../../Display/GlobalEmbeds/privateEmbeds.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages } from '../../../Resources/modules/index.js';
// import { AlreadyErasedFilters, erasedFilters } from '../../../Display/GlobalEmbeds/privateFilterEmbeds.js';
export default <messageCommands>{
    data: {
        name: 'reset',
        description: 'Remove all the filters from the current track/song',
        vote: false,
        type: 1,
        voice: true,
        queue: true,
        player: true,
        samevc: true,
        botconnection: true,
        permissions: ['SendMessages', 'EmbedLinks'],
        slash: true,
        SlashData: {
            Name: 'reset',
            options: []
          },
    },
    execute: async (client: Muzox, message: ContextManager, args: string[]) => {
        try {
            if(message.CheckInteraction){
                await message.setDeffered(false);
            }
            const memberid = message?.author?.id;
            const botid: any = message.guild?.members.me?.id;
            const voiceState = message.guild?.voiceStates.cache.get(memberid);
            const bvoiceState = message.guild?.voiceStates.cache.get(botid);

            const memberVoiceChannel = voiceState?.channel;
            const botVoiceChannel = bvoiceState?.channel;
            const guildId: any = message.guild?.id;
            const channelId: any = voiceState?.channelId;
            const node = client.shoukaku.getIdealNode();
            let player = node.players.get(guildId);
            const queue: Queue = client.queue.get(guildId);
           
            if (queue.filters) {
                
                queue.filters=[]
                queue.player.clearFilters()
                message.reply({
                    embeds:[CommonEmbed.setDescription(Messages.Mfilters.erasedFilters)]
                })
            } else {
                message.reply({
                    embeds:[CommonEmbed.setDescription(Messages.Mfilters.AlreadyErasedFilters)]
                })
            }


        } catch (e) {
      
    }
    },
}
