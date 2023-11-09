import { EmbedBuilder, Message } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, formatTime, EmojisPacket } from '../../../Resources/modules/index.js';
import { FourPageSwitchButtons, NextPreviousButtons } from '../../../Display/GlobalEmbeds/privateButtons.js';
import { Track } from 'shoukaku';
import fs from 'fs'
export default <messageCommands>{
    data: {
        name: 'queue',
        description: 'shows the current queue & upcoming tracks',
        vote: false,
        type: 1,
        player: true,
        queue: true,
        samevc: false,
        voice: true,
        botconnection: false,
        aliases: ["q"],
        permissions: ['SendMessages', 'EmbedLinks'],
        slash: true,
        SlashData: {
            Name: 'queue',
            options: []
          },
    },
    execute: async (client: Muzox, message: ContextManager) => {
        try {

            if(message.CheckInteraction){
                await message.setDeffered(false);
            }
        const memberid = message?.author.id;
        const botid: any = message.guild?.members.me?.id;
        const voiceState = message.guild?.voiceStates.cache.get(memberid);
        const bvoiceState = message.guild?.voiceStates.cache.get(botid);
        const guildId: any = message.guild?.id;
        const channelId: any = voiceState?.channelId;
        const node = client.shoukaku.getIdealNode();
        let player = node.players.get(guildId);
        const queue: Queue = client.queue.get(guildId);
        
        if (!queue) {
            const embed = new EmbedBuilder()
                .setDescription(Messages.Error.NoSongsInQueue)
                .setColor(Messages.Mconfigs.Ecolor)
            return message.reply({ embeds: [embed] })
        }

        
            // fs.writeFileSync('output.txt', JSON.stringify(queue.tracks, null, 2));
          

        let queue_ = queue.tracks//.slice(1,)
            .slice(1)
            .map((track : any , index) => 
                `(${index + 1})・[${track?.info?.title || 'undefined'}](${Messages.Links.SupportLink})・[${track?.info?.isStream ? 'LIVE' : formatTime(track?.info?.length || 0)
                }]`   
            );
           
        if (queue_.length === 0) {
            queue_ = [`${Messages.Error.NoSongsInQueue}`];
        }
        const pages = queue_.reduce((resultArray, item, index) => {
            const chunkIndex = Math.floor(index / 5)
            if (!resultArray[chunkIndex]) {
                resultArray[chunkIndex] = [] 
            }
            resultArray[chunkIndex].push(item)
            return resultArray
        }, [])
        const embeds = pages.map((page, index) => {
            const embed = new EmbedBuilder()
                .setAuthor({ name: `Music Queue`, iconURL: client.user?.displayAvatarURL(), url: Messages.Links.SupportLink})
                .setThumbnail(message?.guild?.iconURL())
               // .setTitle(`Tracks Loaded`)
                .setDescription(`${EmojisPacket.Emojis.VolumeUp} Now Playing:\n [${queue.currentTrackTitle?.substr(0,40) || queue.tracks[0].info.title?.substr(0, 40) || null}](${Messages.Links.SupportLink}) - [${formatTime(queue?.currentTimeLeft)} Left]\n\n `
                    + `${EmojisPacket.Emojis.TracKStart.queue} Upcoming Songs\n` + `${page.join('\n')}`)
                .setColor(Messages.Mconfigs.Ucolor)
                .setFooter(
                    { text: `Page ${index + 1}/${pages.length} | Track's in Queue: ${queue.tracks.length} `, iconURL: client?.user?.displayAvatarURL() }
                )
            return embed
        })
        const message_ = await message.reply({
            embeds: [embeds[0]],
            components: [FourPageSwitchButtons]
        })
        const collector = message_.createMessageComponentCollector({
            filter: (x_) => x_.user.id === message.author.id,
            time: 60000
        })
        let currentIndex = 0
        collector.on('collect', async (x_) => {
            if (x_.customId === 'previous') {
                currentIndex -= 1
                if (currentIndex < 0) {
                    currentIndex = 0
                }
            } else if (x_.customId === 'next') {
                currentIndex += 1
                if (currentIndex >= embeds.length) {
                    currentIndex = embeds.length - 1
                }
            } else if(x_.customId === 'Tnext'){
                currentIndex = embeds.length - 1;
                if (currentIndex >= embeds.length) {
                    currentIndex = embeds.length - 1
                }
            } else if(x_.customId === 'Tprevious'){
                currentIndex = 0;
                if (currentIndex < 0) {
                    currentIndex = 0
                }
            }
            await x_.update({
                embeds: [embeds[currentIndex]],
                components: [FourPageSwitchButtons]
            })
        })
        collector.on('end', async () => {
            await message_.edit({
                embeds: [embeds[currentIndex]],
                components: [FourPageSwitchButtons]
            })
        })
    } catch(e){
        Logger.log(e, "Error")
    }
} 
}
