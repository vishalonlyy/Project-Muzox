import { EmbedBuilder } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, EmojisPacket } from '../../../Resources/modules/index.js';
import { getInfo } from 'discord-hybrid-sharding';
import os from 'os';
import osUtils from 'os-utils';
import prettyMs from 'pretty-ms';
export default <messageCommands>{
    data: {
        name: 'botinfo',
        description: 'check the bot\'s info i.e, stats',
        vote: false,
        aliases: ['bi', 'stats'],
        permissions: ['EmbedLinks', 'SendMessages'],
        slash: true,
        SlashData: {
            Name: 'botinfo',
            options: []
        },
    },
    execute: async (client: Muzox, message: ContextManager, args: string[]) => {
        try {
            if (message.CheckInteraction) {
                await message.setDeffered(false);
            }
            const node = client.shoukaku.getIdealNode()
            const state = node.stats
            // this.client = client;
            const Osuptime = prettyMs(os.uptime() * 1000);
            const uptime = prettyMs(client.uptime);
            let totalMembers = await client.cluster.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)).then(x =>
                x.reduce((a, b) => a + b));
            let totalServers = await client.cluster.fetchClientValues('guilds.cache.size').then(x => x.reduce((a, b) => a + b));
            let players = state.players//.then(x => x.reduce((a, b) => a + b));
            let tmemory = await client.cluster.broadcastEval("process.memoryUsage().rss");
            const getCpuUsage = async () => {
                return new Promise((resolve) => {
                  osUtils.cpuUsage((cpuUsage) => {
                    resolve((cpuUsage * 100).toFixed(2));
                  });
                });
              };
            let osCpuPercentage: osUtils = await getCpuUsage();
            
            const cpus = os.cpus();
            function formatNumber(number) {
                if (number === 0) return "0";
                const units = ["", "K", "M", "B", "T"];
                const unitIndex = Math.floor(Math.log10(number) / 3);
                const formattedNumber = number / Math.pow(1000, unitIndex);
                return `${formattedNumber.toFixed(1)}${units[unitIndex]}`;
            }
            function formatBytes(bytes) {
                if (bytes === 0) return "0 B";
                const sizes = ["B", "KB", "MB", "GB"];
                return `${(
                    bytes / Math.pow(1024, Math.floor(Math.log(bytes) / Math.log(1024)))
                ).toFixed(2)} ${sizes[Math.floor(Math.log(bytes) / Math.log(1024))]}`;
            }

           
            let embed = new EmbedBuilder()
                .setAuthor({ name: `Muzox's Stats`, iconURL: client.user.displayAvatarURL(), url: `${Messages.Links.SupportLink}` })
                .addFields({
                    name: '➨ Client', value: '```nim' + '\n' +
                        `↳ Total Guilds      :: ${formatNumber(totalServers)}\n` +
                        `↳ Cluster Users     :: ${formatNumber(client.guilds.cache.reduce((a, b) => a + b.memberCount, 0))}\n` +
                        `↳ Client Latency    :: ${Math.round(message.client.ws.ping)} ms\n` +
                        `↳ Online Since      :: ${uptime}\n` +
                        `↳ Total Connections :: ${players || '0'}\n` +
                        `↳ Client Shards     :: ${message.guild.shardId}/${client.cluster.info.TOTAL_SHARDS}\n` +
                        `↳ Client Clusters   :: ${client.cluster.id + 1}/${client.cluster.count}\n` +
                        '\n' + '```', inline: false
                })
                .addFields({
                    name: '➨ System', value: '```nim' + '\n' +
                        `↳ Ram Usage         :: ${formatBytes(tmemory.reduce((a, b) => a + b, 0))}\n` +
                        `↳ CPU Usage         :: ${osCpuPercentage}\n` +
                        `↳ Uptime            :: ${Osuptime}\n` +
                        '\n' + '```', inline: false
                })
                .setThumbnail(client.user.displayAvatarURL())
                .setColor(Messages.Mconfigs.Ucolor)
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();


            if (osCpuPercentage === undefined) {
                setTimeout(async () => {
                    await message.reply({
                        embeds: [embed]
                    }).catch((err) => {
                        Logger.log(err, "Error")
                    })
                }, 3000)
            } else {
                await message.reply({
                    embeds: [embed]
                }).catch((err) => {
                    Logger.log(err, "Error")
                })
            }


            //     })
            //     .catch((err) => {


        } catch (e) {
            Logger.log(e, "Error")
        }
    }
} 
