import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder, Message } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, formatTime } from '../../../Resources/modules/index.js';

export default <messageCommands>{
    data: {
        name: 'node',
        description: 'shows the current connection data',
        vote: false,
        permissions: ['EmbedLinks', 'SendMessages'],
        aliases: ['connections'],
        slash: true,
        SlashData: {
            Name: 'node',
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

            const user: any = message?.author.id;
            const sucessEmbed = new EmbedBuilder()
                .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
                .setTitle('Connections Data')
                .addFields({
                    name: `Playing Players`, value: `\`\`\`ts\n${state.playingPlayers}/${state.players}\`\`\``
                },
                    { name: `Cpu Load`, value: `\`\`\`ts\n${state.cpu.lavalinkLoad}\`\`\`` },
                    { name: `Uptime`, value: `\`\`\`ts\n${formatTime(state.uptime)}\`\`\`` }
                )
                .setColor(Messages.Mconfigs.Ucolor)
                
                .setFooter({ text: `${client.user.username}\'s Connection States` })

            ///Developer Embed
            const devEmbed = new EmbedBuilder()
                .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
                .setTitle('Connections Data')
                .addFields({
                    name: `Playing Players`, value: `\`\`\`ts\n${state.playingPlayers}/${state.players}\`\`\``
                },
                    { name: `Ram Usage`, value: `\`\`\`ts\n${state.memory.used}/${state.memory.allocated}\`\`\`` },
                    { name: `Ram Available`, value: `\`\`\`ts\n${state.memory.free}\`\`\`` },
                    { name: `Lavalink Cpu Load`, value: `\`\`\`ts\n${state.cpu.lavalinkLoad}\`\`\`` },
                    { name: `System Cpu Load`, value: `\`\`\`ts\n${state.cpu.systemLoad}\`\`\`` },
                    { name: `Uptime`, value: `\`\`\`ts\n${formatTime(state.uptime)}\`\`\`` }
                )
                .setColor(Messages.Mconfigs.Ucolor)
                
                .setFooter({ text: `${client.user.username}\'s Connection States | Cpu Core : ${state.cpu.cores}` })

            if (client.config.devs.includes(user)) {
                message.reply({
                    embeds: [devEmbed],
                    content: 'Nice to meet you back owner,Here\'s the requested data'
                })
            } else {
                message.reply({
                    embeds: [sucessEmbed]
                })
            }
        } catch (e) {

        }

    }
} 
