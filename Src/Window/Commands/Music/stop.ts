import { EmbedBuilder, Message } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, EmojisPacket } from '../../../Resources/modules/index.js';

export default <messageCommands>{
    data: {
        name: 'stop',
        description: 'Stops the current track and clears the queue',
        playing: true,
        vote: false,
        voice: true,
        queue: true,
        player: true,
        samevc: true,
        botconnection: true,
        permissions: ['Connect', 'SendMessages', 'EmbedLinks'],
        slash: true,
        SlashData: {
            Name: 'stop',
            options: []
          },
    },
    execute: async (client: Muzox, message: ContextManager, args: string[]) => {


        try {
            if(message.CheckInteraction){
                await message.setDeffered(false);
            }
            const memberid = message?.author.id;
            const botid: any = message.guild?.members.me?.id;
            const voiceState = message.guild?.voiceStates.cache.get(memberid);
            const bvoiceState = message.guild?.voiceStates.cache.get(botid);

            const memberVoiceChannel = voiceState?.channel;
            const botVoiceChannel = bvoiceState?.channel;
            const guildId: any = message.guild?.id;
            const channelId: any = voiceState?.channelId;
            const node = client.shoukaku.getIdealNode();

            let player = node.players.get(guildId);
        
            message.react('⏹️').catch(e=>{
                message.reply({embeds: [ new EmbedBuilder()
                    .setColor(Messages.Mconfigs.color)
                    .setDescription(`${message.channel.permissionsFor(client.user).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.TracKStart.stop}` : `${EmojisPacket.Emojis.NormalEmojis.Stop} ${Messages.Messages.StopAndCleared}`}`)
                ]})
            })
            if (player && memberVoiceChannel === botVoiceChannel) {
                Promise.all([
                    player.stopTrack(),
                    client.queue.clear(),
                ])
                .catch((error) => { 
                    Logger.log(error,"Error");
                });
            }
        } catch (e) {
            Logger.log(e,"Error")
        }

    }
}
