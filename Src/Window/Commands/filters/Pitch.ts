import { ApplicationCommandOptionType } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, EmojisPacket, Messages } from '../../../Resources/modules/index.js';
import { CommonEmbed } from '../../../Display/GlobalEmbeds/privateEmbeds.js';
export default <messageCommands>{
    data: {
        name: 'pitch',
        description: 'Add/switch filter to update pitch for playing track/songs',
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
            Name: 'pitch',
            options: [
                {
                    name: 'pitchvalue',
                    description: 'Provide the pitch value b/w 1 - 10',
                    type: ApplicationCommandOptionType.Number,
                    required: true,

                },
            ],
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
            const pitch : any = message.Options('pitchvalue')
            if (pitch > 10 || pitch < 1) {
                message.reply({
                    content: 'Please provide the pitch value b/w 1 - 10'
                })
            }
            if (queue && player) {
                queue.player.setTimescale(
                    { pitch: pitch, rate: 1, speed: 1 }
                )
                queue.filters.push('pitch')
                message.reply({
                    embeds: [CommonEmbed.setDescription(`${EmojisPacket.Emojis.correct} Pitch ${Messages.Mfilters.Activated}, Value: ${pitch}`)]
                })
            }


        } catch (e) {
      
    }
    },
}
