import { ActionRowBuilder, ComponentType, EmbedBuilder, Message, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import Muzox from "../../../Structures/Muzox_Client.js";
import { messageCommands } from "../../../Interfaces/Interfaces.js";
import Logger from "../../../Resources/Console/MuzoxConsole.js";
import util from 'util';
import Messages from "../../../Display/Messages/Messages.js";

export default <messageCommands>{
    data: {
        name: 'engine',
        description: "Change the SearchEngine to optimize search Songs / Tracks",
        vote: false,
        voice: false,
        queue: false,
        player: false,
        samevc: false,
        botconnection: false,
        aliases: ['chnageengine', 'ce', 'searchengine'],
        permissions: ['SendMessages', 'EmbedLinks'],
        slash: true,
        SlashData: {
            Name: 'engine',
            options: []
          },
    },
    execute: async (client: Muzox, message: Message, args: string[]) => {
        try {




            const prisma = client.prisma;
            const userId_: string = message.author.id;
            const select = new StringSelectMenuBuilder()
                .setCustomId('Main Page')
                .setPlaceholder('Select Your Menu')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('DefaultEngine')
                        .setDescription('Switch SearchEngine to DefaultEngine')
                        .setValue('DefaultEngine'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('SoundCloudEngine')
                        .setDescription('Switch SearchEngine to SoundCloud')
                        .setValue('SoundCloudEngine'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('SpotifyEngine')
                        .setDescription('Switch SearchEngine to Spotify')
                        .setValue('SpotifyEngine'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('PremiumEngine')
                        .setDescription('Switch SearchEngine to PremiumEngine')
                        .setValue('PremiumEngine'),
                    
                )
            const row: ActionRowBuilder | any = new ActionRowBuilder()
                .addComponents(select)


            const Main_Page = new EmbedBuilder()
                .setAuthor({ name: "Muzox", iconURL: client.user.displayAvatarURL() })
                .setThumbnail(message.client.user.displayAvatarURL())
                .setColor(Messages.Mconfigs.Ucolor)
                .setDescription(`Switch your searchengines, incase haveing any trouble while searching Songs / Tracks : \n\n By the below menu select the Engine offered by the :: **${client.user.username}**'s system`)
            await message.reply({
                embeds: [Main_Page],
                components: [row]
            }).then(async (message) => {
                const collector = message.createMessageComponentCollector({ componentType: ComponentType.StringSelect });
                const NormalGuilds = await prisma.guildData.findUnique({
                    where: {
                        guildId: message?.guildId,
                    },
                });
                
                    const PremiumGuilds = await prisma.guildPremium.findFirst({
                        where: {
                            guildId: message?.guildId,
                            
                        },
                    });
                    
                

                if (!NormalGuilds) await prisma.guildData.create({
                    data: {
                        guildId: message?.guildId,
                        SearchEngine: "ytsearch",
                    },
                });



                let Shifted: string;
                const EngineEmbedData_ = new EmbedBuilder()
                    .setAuthor({ name: "Muzox", iconURL: client.user.displayAvatarURL() })
                    // .setDescription(`Your SearchEngine has been shifted to the new Engine :: \`${Shifted}\``)
                    .setColor(Messages.Mconfigs.Ucolor)
                    .setTimestamp();



                let AcceptedPremiumEngine: any;

                if (PremiumGuilds?.Premium === true) {
                    AcceptedPremiumEngine = new EmbedBuilder()
                        .setAuthor({ name: "Muzox", iconURL: client.user.displayAvatarURL() })
                        .setDescription(`Your SearchEngine has been shifted to :: \`PremiumEngine\``)
                        .setColor(Messages.Mconfigs.Ucolor)
                        .setTimestamp()
                        ;

                    await prisma.guildData.update({
                        where: {
                            guildId: message?.guildId,
                        },
                        data: {
                            SearchEngine: "ytmsearch",
                        },
                    });
                } else {
                    AcceptedPremiumEngine = new EmbedBuilder()
                        .setAuthor({ name: "Muzox", iconURL: client.user.displayAvatarURL() })
                        .setDescription(`Your guild is currently not a premium guild due to which you cannot shift to \`PremiumSearchEngine\`,\n please join our support server to get premium / report issues about this [Support Server](${Messages.Links.SupportLink})`)
                        .setColor(Messages.Mconfigs.Ucolor)
                        .setTimestamp();
                }


                collector.on("collect", async (collected: any) => {
                    const value = collected.values[0]
                    if (value === "DefaultEngine") {
                        Shifted = "DefaultEngine";
                        EngineEmbedData_.setDescription(`Your SearchEngine has been shifted to the new Engine :: \`${Shifted}\``)
                        await prisma.guildData.update({
                            where: {
                                guildId: message?.guildId,
                            },
                            data: {
                                SearchEngine: 'ytsearch',
                            },
                        });
                        collected.reply({ embeds: [EngineEmbedData_], ephemeral: false })
                    }
                    if (value === "SoundCloudEngine") {
                        Shifted = "SoundCloudEngine";
                        EngineEmbedData_.setDescription(`Your SearchEngine has been shifted to the new Engine :: \`${Shifted}\``)
                        await prisma.guildData.update({
                            where: {
                                guildId: message?.guildId,
                            },
                            data: {
                                SearchEngine: "scsearch",
                            },
                        });
                        collected.reply({ embeds: [EngineEmbedData_], ephemeral: true })
                    }
                    if(value === "SpotifyEngine"){
                        Shifted = "SpotifyEngine";
                        EngineEmbedData_.setDescription(`Your SearchEngine has been shifted to the new Engine :: \`${Shifted}\``)
                        await prisma.guildData.update({
                            where: {
                                guildId: message?.guildId,
                            },
                            data: {
                                SearchEngine: "spsearch",
                            },
                        });
                        collected.reply({ embeds: [EngineEmbedData_], ephemeral: true })
                    }
                    if (value === "PremiumEngine") {
                        Shifted = "PremiumEngine";
                        collected.reply({ embeds: [AcceptedPremiumEngine], ephemeral: true })
                    }
                })
            })
        } catch (e) {
            Logger.log(e, "Error")
        }
    }
}