import { ActionRowBuilder, ApplicationCommandOptionType, ChatInputCommandInteraction, CommandInteraction, ComponentType, EmbedBuilder, Interaction, Message, MessageCollector, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, time } from "discord.js";
import Muzox from "../../../Structures/Muzox_Client.js";
import { messageCommands } from "../../../Interfaces/Interfaces.js";
import Logger from "../../../Resources/Console/MuzoxConsole.js";
import util from 'util';
import Messages from "../../../Display/Messages/Messages.js";
import GeneratePlaylistString from "../../../Display/Utils/generatePlaylistString.js";
import { NextPreviousButtons } from "../../../Display/GlobalEmbeds/privateButtons.js";
import Queue from "../../../Structures/Queue.js";
import { MgetQueue } from "../../../Display/Utils/MgetQueue.js";
import { InvalidPlaylistSelection, Noplaylist, PlaylistDeleted, PlaylistExists, PlaylistNameERR } from "../../../Display/GlobalEmbeds/privateEmbeds.js";
import ContextManager from "../../../Structures/Manager/CTX.js";
import FindQueue from "../../../Display/Utils/FindQueue.js";

export default <messageCommands>{
    data: {
        name: 'playlist',
        description: "playlist command",
        vote: false,
        voice: false,
        queue: false,
        player: false,
        playlist: true,
        samevc: false,
        botconnection: false,
        aliases: ['pl'],
        permissions: ['SendMessages', 'EmbedLinks'],
        slash: true,
        SlashData: {
            Name: 'playlist',
            options: [
                {
                    name:"help",
                    description:"playlist help desk view",
                    type:ApplicationCommandOptionType.Subcommand,
                    options:[]
                },
                {
                    name: 'create',
                    description: 'create a playlist',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'name',
                            description: 'name of the playlist',
                            type: ApplicationCommandOptionType.String,
                            required: true
                        }
                    ]

                },
                {
                    name: 'delete',
                    description: 'delete a playlist',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'name',
                            description: 'name of the playlist',
                            type: ApplicationCommandOptionType.String,
                            required: true
                        }
                    ]
                },
                {
                    name: 'list',
                    description: 'list all your playlists',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: []
                },
                {
                    name: 'info',
                    description: 'get info about a playlist',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                    ]
                },
                {
                    name: 'addtrack',
                    description: 'add a song to a playlist',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: []
                },
                {
                    name: 'removetrack',
                    description: 'remove a song from a playlist',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: []
                },
                {
                    name: 'load',
                    description: 'load a playlist',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: []
                }
            ]
        }
    },
    execute: async (client: Muzox, message: ContextManager, args: string[], x: CommandInteraction | any) => {
        let SubCmd: any;
        let SubSDetails : any;
        let Instance_Exec: string;
        let values: string;
        let interaction : boolean = false;

        if (message.CheckInteraction) {
            interaction = true;
            await message.setDeffered(false);
            SubCmd = x.options?.getSubcommand() as any;
            if (SubCmd === 'create') {
                Instance_Exec = 'create';
                values = x.options?.getString('name') as any;
            }
            if (SubCmd === 'delete') {
                Instance_Exec = 'delete';
                values = x.options?.getString('name') as any;
            }
            if (SubCmd === 'list') {
                Instance_Exec = 'list';
            }
            if (SubCmd === 'info') {
                Instance_Exec = 'info';
                values = x.options?.getString('name') as any;
            }
            if (SubCmd === 'addtrack') {
                Instance_Exec = 'addtrack';
                values = x.options?.getString('name') as any;
            }
            if (SubCmd === 'removetrack') {
                Instance_Exec = 'removetrack';
                values = x.options?.getString('name') as any;
            }
            if (SubCmd === 'load') {
                Instance_Exec = 'load';
                values = x.options?.getString('name') as any;
            }
            if(SubCmd === 'play'){
                Instance_Exec = 'play';
                values = x.options?.getString('name') as any;
            }
            if(SubCmd === 'help'){
                Instance_Exec = 'help';
            }
        };



        const prisma = client.prisma;
        const userCheck = await prisma.user.findUnique({
            where: {
                userId: message.author.id
            }
        })
        const playlists = await client.prisma.user
            .findUnique({ where: { userId: message.author.id } })
            .playlists();
        if (!userCheck) {
            await prisma.user.create({
                data: {
                    userId: message.author.id,
                }
            })
        }


        try {
            if(!interaction){
               Instance_Exec = args[0];
                values = args.slice(1).join(' ');
               //console.log("Building Playlist system based on Messages"+Instance_Exec)
            }
            if (!Instance_Exec || Instance_Exec === 'help') {
                let d = `-`
                const data = [
                    {
                        help: {name:`${d} \`playlist help\` - `,value:`Get Help Desk about the playlist system`},
                        create: {name:`${d} \`playlist create\` - `,value:`Create a new personal playlist`},
                        delete: {name:`${d} \`playlist delete\` - `,value:`Delete a personal playlist`},
                        list: {name:`${d} \`playlist list\` - `,value:`List all your personal playlists`},
                        info: {name:`${d} \`playlist info\` - `,value:`Get info about a specific playlist`},
                        addtrack: {name:`${d} \`playlist addtrack\` - `,value:`Add a song to a playlist`},
                        removetrack: {name:`${d} \`playlist removetrack\` - `,value:`Remove a song from a playlist`},
                        load: {name:`${d} \`playlist load\` - `,value:`Load a playlist to the queue`},
                        play: {name:`${d} \`playlist play\` - `,value:`Play a personal playlist`},


                    }
                ]
                const valid_SubCmd = new EmbedBuilder()
                .setThumbnail(message.author.displayAvatarURL())
                    // .setDescription(`Please select a valid subcommand`)
                    // .setAuthor({ name:`${client.user.username} HelpDesk - Playlists`, iconURL: message.author.displayAvatarURL() })
                    .addFields({value:`\n${data[0].help.name}${data[0].help.value}\n${data[0].create.name}${data[0].create.value}\n${data[0].delete.name}${data[0].delete.value}\n${data[0].list.name}${data[0].list.value}\n${data[0].info.name}${data[0].info.value}\n${data[0].addtrack.name}${data[0].addtrack.value}\n${data[0].removetrack.name}${data[0].removetrack.value}\n${data[0].load.name}${data[0].load.value}\n${data[0].play.name}${data[0].play.value}\n`
                    ,name:`${client.user.username} HelpDesk - Playlists`, inline:false})
                    .setColor(Messages.Mconfigs.Ucolor);
                return message.reply({embeds:[valid_SubCmd], ephemeral: true});
            }


            if (Instance_Exec === 'create') {
                // console.log("Creating Playlist")
                if (userCheck && values) {
                    const PlaylistUrl = GeneratePlaylistString(22);
                    if (values.length > 50) return message.channel.send({
                        embeds: [PlaylistNameERR]
                    })
                    const playlist = await client.prisma.playlist.findFirst({
                        where: {
                            userId: message.author.id,
                            name: values
                        }
                    })
                    if (playlist) return message.channel.send({
                        embeds: [PlaylistExists]
                    })
                    // console.log("Creating Playlist 0x2")
                    await client.prisma.playlist.create({
                        data: {
                            name: values,
                            userId: userCheck.userId,
                            songs: [`${Date.now()}`],
                            Url: PlaylistUrl
                        }
                    });
                    // console.log("Creating Playlist 0x3")
                    const PlaylistCreated = new EmbedBuilder()
                        .setDescription(`Playlist sucessfully created with name : **${values}** and urlString : ${PlaylistUrl}`)
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setTimestamp()
                        .setTitle(`Playlist`)
                        .setColor(Messages.Mconfigs.Ucolor);
                    return await message.channel.send({
                        embeds: [PlaylistCreated]
                    })
                }
            }


            if (Instance_Exec === 'delete') {
                await prisma.playlist.deleteMany({
                    where: {
                        userId: message.author.id,
                        name: values
                    }
                })
                return message.channel.send({
                    embeds: [PlaylistDeleted]
                })
            }


            if (Instance_Exec === 'list') {

                let queue_ = [...playlists]
                    .slice(0)
                    .map((playlist, index) =>
                        `
                 \`${index + 1}.\` **${playlist.name}** (\`${playlist.songs.length} Track(s)\`) - \`[${playlist.Like} Likes)]\`
                 `
                    )
                if (queue_.length === 0) {
                    queue_ = ["\nNo playlist found"];
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
                        .setAuthor({ name: message.author.username + '\'s Playlists', iconURL: message.author.displayAvatarURL() })
                        .setDescription(`**__Your Playlist(s)__**${page.join('')}`)
                        .setColor(Messages.Mconfigs.Ucolor)
                        .setTimestamp()
                        .setThumbnail(message.client.user.displayAvatarURL())
                        .setFooter(
                            { text: `Pages ${index + 1} - ${pages.length} ` }
                        )
                    return embed
                })
                const message_ = await message.reply({
                    embeds: [embeds[0]],
                    components: [NextPreviousButtons]
                })
                const collector = message_.createMessageComponentCollector({
                    filter: (x_) => x_.user.id === message.author.id,
                    time: 60000
                })
                let currentIndex = 0
                collector.on('collect', async (x_) => {
                    if(x_.user.id !== message.author.id) return x_.reply({content:`This is not your playlist!`})
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
                    }
                    await x_.update({
                        embeds: [embeds[currentIndex]],
                        components: [NextPreviousButtons]
                    })
                })
                collector.on('end', async () => {
                    await message_.edit({
                        embeds: [embeds[currentIndex]],
                        components: [NextPreviousButtons]
                    })
                })
            }


            if (Instance_Exec === 'info') {
                if (playlists.length === 0) {
                    message.channel.send({
                        embeds: [Noplaylist]
                    });
                    return;
                }
                const playlistOptions = playlists.map((playlist) => new StringSelectMenuOptionBuilder()
                    .setLabel(playlist.name)
                    .setValue(playlist.id)
                )
                const selectMenu = new StringSelectMenuBuilder()
                    .setCustomId('Main Page')
                    .setPlaceholder('Select a playlist')
                    .addOptions(playlistOptions);
                const row: ActionRowBuilder | any = new ActionRowBuilder()
                    .addComponents(selectMenu);
                const Embed = new EmbedBuilder()
                    .setColor(Messages.Mconfigs.Ucolor)
                    .setDescription(`Select a playlist to get info about the loaded songs in it! `)
                    // .setTimestamp()
                    // .setThumbnail(message.client.user.displayAvatarURL())
                message.channel.send({ embeds: [Embed], components: [row] })
                    .then(async (message__) => {

                        const collector = message__.createMessageComponentCollector({ componentType: ComponentType.StringSelect });


                        collector.on("collect", async (collected: any) => {
                            const value = collected.values[0];
                            message__.delete();
                            const playlist = await client.prisma.playlist.findUnique({
                                where: { id: value },
                            });
                            if (!playlist) {
                                collected.reply({
                                    embeds: [InvalidPlaylistSelection]
                                });
                                return;
                            }
                            let queue_ = playlist.songs
                                .slice(1)
                                .map((song, index) =>
                                    `\`${index + 1}.\` ${song}`
                                )
                            if (queue_.length === 0) {
                                queue_ = ["No tracks in queue!"];
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
                                    .setAuthor({ name: message.author.username + '\'s Playlists', iconURL: message.author.displayAvatarURL() })
                                    .setDescription(`__Playlist-__**__${playlist.name}__**\n\n${page.join('\n')}`)
                                    .setColor(Messages.Mconfigs.Ucolor)
                                    .setTimestamp()
                                    .setThumbnail(message.client.user.displayAvatarURL())
                                    .setFooter(
                                        { text: `Pages ${index + 1} - ${pages.length} ` }
                                    )
                                return embed
                            })
                            const message_ = await message.reply({
                                embeds: [embeds[0]],
                                components: [NextPreviousButtons]
                            })
                            const secondcollector = message_.createMessageComponentCollector({
                                filter: (x_) => x_.user.id === message.author.id,
                                time: 60000
                            })

                            let currentIndex = 0
                            secondcollector.on('collect', async (x_) => {
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
                                }
                                await x_.update({
                                    embeds: [embeds[currentIndex]],
                                    components: [NextPreviousButtons]
                                })
                            })
                            secondcollector.on('end', async () => {
                                await message_.edit({
                                    embeds: [embeds[currentIndex]],
                                    components: [NextPreviousButtons]
                                })
                            })
                        })
                    })
            }



            if (Instance_Exec === 'addtrack') {
                const queue: Queue = client.queue.get(message.guild?.id)
                if (!queue) {
                    const ErrEmbed_NothingbeingPlayed = new EmbedBuilder()
                        .setColor(Messages.Mconfigs.Ucolor)
                        .setDescription(`This Command can only be used when a song is being played!. Inorder to add the current playing song to a playlist! `)
                        .setTimestamp()
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                    message.reply({ embeds: [ErrEmbed_NothingbeingPlayed] })
                    return;
                }
                if (queue && Instance_Exec === 'addtrack') {
                    const playlists = await client.prisma.user
                        .findUnique({ where: { userId: message.author.id } })
                        .playlists();
                    if (playlists.length === 0) {
                        message.channel.send({
                            embeds: [Noplaylist]
                        });
                        return;
                    }
                    const playlistOptions = playlists.map((playlist) => new StringSelectMenuOptionBuilder()
                        .setLabel(playlist.name)
                        .setValue(playlist.id)
                    )
                    const selectMenu = new StringSelectMenuBuilder()
                        .setCustomId('Main Page')
                        .setPlaceholder('Select a playlist Where u want to add the Current playing song')
                        .addOptions(playlistOptions);
                    const row: ActionRowBuilder | any = new ActionRowBuilder()
                        .addComponents(selectMenu);
                    const Embed = new EmbedBuilder()
                        .setColor(Messages.Mconfigs.Ucolor)
                        .setDescription(`Select a playlist Where u want to add the current playing track to! `)
                        .setTimestamp()
                        .setThumbnail(message.client.user.displayAvatarURL())
                    message.channel.send({ embeds: [Embed], components: [row] })
                        .then(async (message__) => {

                            const collector = message__.createMessageComponentCollector({ componentType: ComponentType.StringSelect });


                            collector.on("collect", async (collected: any) => {

                                const value = collected.values[0];
                                message__.delete();
                                const playlist = await client.prisma.playlist.findUnique({
                                    where: { id: value },
                                });
                                if (!playlist) {
                                    collected.reply({
                                        embeds: [InvalidPlaylistSelection]
                                    });
                                    return;
                                }
                                const song = queue.currentTrackTitle;
                                if (playlist.songs.includes(song)) {
                                    message.reply(`The song ${song} is already in ${playlist.name}!`)
                                    return;
                                }
                                await client.prisma.playlist.update({
                                    where: { id: playlist.id },
                                    data: { songs: { push: song } },
                                }).then(() => {
                                    message.reply(`Added ${song} to ${playlist.name}!`)
                                })
                            })
                        })
                }
            }



            if (Instance_Exec === 'removetrack') {
                if (playlists.length === 0) {
                    message.channel.send({
                        embeds: [Noplaylist]
                    });
                    return;
                }
                const playlistOptions = playlists.map((playlist) => new StringSelectMenuOptionBuilder()
                    .setLabel(playlist.name)
                    .setValue(playlist.id)
                )
                const selectMenu = new StringSelectMenuBuilder()
                    .setCustomId('Main Page')
                    .setPlaceholder('Select a playlist')
                    .addOptions(playlistOptions);
                const row: ActionRowBuilder | any = new ActionRowBuilder()
                    .addComponents(selectMenu);
                const Embed = new EmbedBuilder()
                    .setColor(Messages.Mconfigs.Ucolor)
                    .setDescription(`Select a playlist Where u want to remove a track from the Current playing song`)
                    .setTimestamp()
                    .setThumbnail(message.client.user.displayAvatarURL())
                    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() });
                message.channel.send({ embeds: [Embed], components: [row] })
                    .then(async (message__) => {

                        const collector = message__.createMessageComponentCollector({ componentType: ComponentType.StringSelect });


                        collector.on("collect", async (collected: any) => {

                            const value = collected.values[0];
                            message__.delete();
                            const playlist = await client.prisma.playlist.findUnique({
                                where: { id: value },
                            });
                            if (!playlist) {
                                collected.reply({
                                    embeds: [InvalidPlaylistSelection]
                                });
                                return;
                            }
                            const filter = (m: Message) => m.author.id === message.author.id;
                            message.channel.send({
                                content: 'Enter the track number you want to remove from the current playing playlist!'
                            });
                            const M_collector = new MessageCollector(message.channel, {
                                filter,

                                max: 1,
                                time: 100000,
                            });
                            M_collector.on('collect', async (m) => {
                                const input = parseInt(m.content);
                                if (isNaN(input) || input < 1 || input > 10) {
                                    message.channel.send({
                                        content: 'Invalid input! operation cancelled!'
                                    });
                                    return;
                                }
                                const newSongs = [...playlist.songs];
                                newSongs.splice(input, 1);
                                await client.prisma.playlist.update({
                                    where: { id: playlist.id },
                                    data: { songs: newSongs },
                                }).then(() => {
                                    message.reply({
                                        content: `Removed track No : ${input} from Current Playing playlist : ${playlist.name}!`
                                    })
                                }
                                )

                            });
                            M_collector.on('end', (collected) => {
                                if (collected.size === 0) {
                                    message.channel.send({
                                        content: 'You did not provide any input! operation cancelled!'
                                    });
                                }
                            });
                        })

                    })

            }



            if (Instance_Exec === 'load') {
                if (playlists.length === 0) {
                    message.channel.send({

                    });
                    return;
                }
                const playlistOptions_ = playlists.map((playlist) => new StringSelectMenuOptionBuilder()

                    .setLabel(playlist.name)
                    .setValue(playlist.id)
                )
                const selectMenu_ = new StringSelectMenuBuilder()
                    .setCustomId('Main Page')
                    .setPlaceholder('Select a playlist to load')
                    .addOptions(playlistOptions_);
                const row_: ActionRowBuilder | any = new ActionRowBuilder()
                    .addComponents(selectMenu_);
                const Embed = new EmbedBuilder()
                    .setColor(Messages.Mconfigs.Ucolor)
                    .setDescription(`Select a playlist to Load`)
                    .setTimestamp()
                    .setThumbnail(message.client.user.displayAvatarURL())
                    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() });
                message.channel.send({ embeds: [Embed], components: [row_] })
                    .then(async (message__) => {

                        const collector = message__.createMessageComponentCollector({ componentType: ComponentType.StringSelect });

                        const queue: Queue = await FindQueue(client, message.guild?.id, message.ctx)

                        if (queue) {

                            collector.on("collect", async (collected: any) => {
                                const value = collected.values[0];
                                message__.delete();
                                const playlist = await client.prisma.playlist.findUnique({
                                    where: { id: value },
                                });
                                if (!playlist) {
                                    collected.reply({
                                        embeds: [InvalidPlaylistSelection]
                                    });
                                    return;
                                }

                                let Engine_: string;
                                const Engine = await client.prisma.guildData.findUnique({
                                    where: {
                                        guildId: message.guild?.id
                                    }
                                })

                                if (Engine) {
                                    Engine_ = Engine.SearchEngine;
                                } else {
                                    Engine_ = client.config.searchEngine;
                                }
                                const node = client.shoukaku.getIdealNode();
                                const preSong = await node.rest.resolve(`${Engine_}:${playlist.songs[1]}`);
                                const LoadPreSong = preSong;
                                const LoadEmbed = new EmbedBuilder()
                                    .setColor(Messages.Mconfigs.Ucolor)
                                    .setDescription(`Playlist :: **${playlist.name}** sucessfully loaded to your queue. Total tracks loaded : **${playlist.songs.length - 1}**`)
                                    .setTimestamp()
                                    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() });
                                if (!queue.playing) {
                                    const dispatcher = await queue.play(LoadPreSong, message.channelId, message.author, message.ctx)
                                    if (playlist.songs.length > 1) {
                                        const LoadExtraSong = playlist.songs.slice(2);
                                        const promises = LoadExtraSong.map(async (song) => {
                                            const track1: any = await node.rest.resolve(`${Engine_}:${song}`);
                                            const track = track1.tracks[0];
                                            await queue.push(track)
                                        });

                                        await Promise.all(promises);
                                    }

                                } else {

                                    const LoadExtraSong = playlist.songs.slice(1);
                                    const promises = LoadExtraSong.map(async (song) => {
                                        const track1: any = await node.rest.resolve(`${Engine_}:${song}`);
                                        const track = track1.tracks[0];
                                        await queue.push(track)
                                    });

                                    await Promise.all(promises);

                                }
                                message.reply({
                                    embeds: [LoadEmbed]
                                })

                            })

                        }
                    })
            }



            if (Instance_Exec === 'play') {

                if (playlists.length === 0) {
                    message.channel.send({

                    });
                    return;
                }
                const playlistOptions_ = playlists.map((playlist) => new StringSelectMenuOptionBuilder()

                    .setLabel(playlist.name)
                    .setValue(playlist.id)
                )
                const selectMenu_ = new StringSelectMenuBuilder()
                    .setCustomId('Main Page')
                    .setPlaceholder('Select a playlist to Play')
                    .addOptions(playlistOptions_);
                const row_: ActionRowBuilder | any = new ActionRowBuilder()
                    .addComponents(selectMenu_);
                const Embed = new EmbedBuilder()
                    .setColor(Messages.Mconfigs.Ucolor)
                    .setDescription(`Select a playlist to Play\n **Note** : This will clear your current queue and play the selected playlist!`)
                    .setTimestamp()
                    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() });
                message.channel.send({ embeds: [Embed], components: [row_] })
                    .then(async (message__) => {

                        const collector = message__.createMessageComponentCollector({ componentType: ComponentType.StringSelect });

                        const queue: Queue = await FindQueue(client, message.guild?.id, message.ctx)

                        if (queue) {

                            collector.on("collect", async (collected: any) => {
                                const value = collected.values[0];
                                message__.delete();
                                const playlist = await client.prisma.playlist.findUnique({
                                    where: { id: value },
                                });
                                if (!playlist) {
                                    collected.reply({
                                        embeds: [InvalidPlaylistSelection]
                                    });
                                    return;
                                }

                                let Engine_: string;
                                const Engine = await client.prisma.guildData.findUnique({
                                    where: {
                                        guildId: message.guild?.id
                                    }
                                })

                                if (Engine) {
                                    Engine_ = Engine.SearchEngine;
                                } else {
                                    Engine_ = client.config.searchEngine;
                                }
                                const node = client.shoukaku.getIdealNode();
                                const preSong = await node.rest.resolve(`${Engine_}:${playlist.songs[1]}`);
                                const LoadPreSong = preSong;

                                if (!queue.playing) {
                                    const dispatcher = await queue.play(LoadPreSong, message.channelId, message.author, message.ctx)
                                    if (playlist.songs.length > 1) {
                                        const LoadExtraSong = playlist.songs.slice(2);
                                        const promises = LoadExtraSong.map(async (song) => {
                                            const track1: any = await node.rest.resolve(`${Engine_}:${song}`);
                                            const track = track1.tracks[0];
                                            await queue.push(track)
                                        });

                                        await Promise.all(promises);
                                    }

                                } else {
                                    const StartedPlaying = new EmbedBuilder()
                                        .setDescription(`All the tracks from the queue Erased & Started Playing playlist :: **${playlist.name}**`)
                                        .setColor(Messages.Mconfigs.Ecolor)

                                    await queue.clear().then(async () => {
                                        await queue.play(LoadPreSong, message.channelId, message.author, message.ctx)
                                        if (playlist.songs.length > 1) {
                                            const LoadExtraSong = playlist.songs.slice(1);
                                            const promises = LoadExtraSong.map(async (song) => {
                                                const track1: any = await node.rest.resolve(`${Engine_}:${song}`);
                                                const track = track1.tracks[0];
                                                await queue.push(track)
                                            });

                                            await Promise.all(promises);
                                        }
                                    })
                                    message.reply({
                                        embeds: [StartedPlaying]
                                    })
                                }

                            })
                        }
                    })
            }







        } catch (err) {
            Logger.log(err, "Error")
        }
    }
}