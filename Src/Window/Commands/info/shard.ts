import { Message, EmbedBuilder } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, EmojisPacket } from '../../../Resources/modules/index.js';
import { getInfo } from 'discord-hybrid-sharding';

export default <messageCommands>{
    data: {
        name: 'shards',
        description: 'display the current shard information/global information',
        vote: false,
        voice: false,
        queue: false,
        player: false,
        samevc: false,
        botconnection: false,
        aliases: ["shard"],
        permissions:['EmbedLinks','SendMessages'],
        slash: true,
        SlashData: {
            Name: 'shards',
            options: []
          },
    },


    execute: async (client: Muzox, message: ContextManager, args: string[]) => {
        try {
            if(message.CheckInteraction){
                await message.setDeffered(false);
            }
            let memory = await client.cluster.broadcastEval(async () => process.memoryUsage().rss);
            const sharddata = new EmbedBuilder()
            .setAuthor({name:'Current Shard', iconURL:client.user.displayAvatarURL(), url:`${Messages.Links.SupportLink}`})
                .addFields(
                    { name: 'Guild Name', value: `\`\`\`ts\n${message.guild?.name}\`\`\`` },
                    {name:'Guild Id', value:`\`\`\`ts\n${message.guild?.id}\`\`\``},
                    // { name: 'Cluster Id', value: `\`\`\`ts\n${getInfo().CLUSTER}\`\`\`` },
                    { name: 'Shard Id', value: `\`\`\`\n${message.guild.shardId}/${getInfo().TOTAL_SHARDS}\`\`\`` },
                    { name: 'Shard Ping', value: `\`\`\`${client.ws.ping}\`\`\``, },
                    { name: 'Ram Usage', value:`\`\`\`${Math.round(memory[getInfo().CLUSTER] / 1024 / 1024)} MB\`\`\``}
                    // { name: 'Maintenance', value: `\`\`\`\n${client.mode.maintenance}\`\`\`` }
                )
                .setColor(Messages.Mconfigs.Ucolor)
                .setTimestamp()
                .setThumbnail(message.guild.iconURL({size:1024}))
                .setFooter({text:`${message.guild?.name}`, iconURL:message.guild.iconURL()})

            message.reply({ embeds: [sharddata] })

        } catch (e) {
      
    }
    }
}
