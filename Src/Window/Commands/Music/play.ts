import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder, Message } from 'discord.js';
import { messageCommands } from '../../../Interfaces/Interfaces.js';
import Muzox from '../../../Structures/Muzox_Client.js';
import Messages from '../../../Display/Messages/Messages.js';
import formatTime from '../../../Display/Utils/formattime.js';
import { MgetQueue } from '../../../Display/Utils/MgetQueue.js';
import Logger from '../../../Resources/Console/MuzoxConsole.js';
import Queue from '../../../Structures/Queue.js';
import { LavalinkResponse, LoadType, Track, TrackLoadResult } from 'shoukaku';
import { getQueue } from '../../../Display/Utils/getQueue.js';
import Context from '../../../Structures/Manager/CTX.js';
import ContextManager from '../../../Structures/Manager/CTX.js';
import FindQueue from '../../../Display/Utils/FindQueue.js';
import { EmojisPacket } from '../../../Resources/modules/index.js';
import { Muzox_PauseCancelled, Muzox_Playing_SecondRow } from '../../../Display/GlobalEmbeds/privateButtons.js';



export default <messageCommands>{
  data: {
    name: 'play',
    description: "Play a song to start the party",
    vote: false,
    voice: true,
    queueState: false,
    samevc: false,
    permissions: ['EmbedLinks', 'Speak', 'Connect'],
    aliases: ["p"],
    slash: true,
    SlashData: {
      name: 'play',
      options: [
        {
          name: 'song',
          description: 'The song you want to play',
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
        },
      ],
    },
    Switches: {
      FullErr: true,
      ViewErr: true,
    }


  },
  execute: async (client: Muzox, message: ContextManager, args: string[]) => {
    let searchQuery: string | any;
    try {
      if (message.CheckInteraction) {
        await message.setDeffered(false);
      }
      let Engine_: string = 'ytsearch';
      const Engine = await client.prisma.guildData.findUnique({
        where: {
          guildId: message.guild?.id
        }
      })
      if (Engine) {
        Engine_ = Engine.SearchEngine || 'ytsearch';
      } else {
        Engine_ = client.config.searchEngine || 'ytsearch';
      }


      const guildId: any = message.guild?.id;
      const node = client.shoukaku.getIdealNode();
      let handler: Queue = null;
      // const ctx = new ContextManager(message, args);
      searchQuery = await message.Options('song');
      if (searchQuery.includes('open.spotify')) {
        Engine_ = 'spsearch'
      }
      var words = ["youtube", "youtubemusic", "ytube", "youtu"]

      for (var i = 0; i < words.length; i++) {
        if (searchQuery.includes(words[i])) {
          return message.reply({
            embeds: [new EmbedBuilder()
              .setColor(Messages.Mconfigs.color)

              .setAuthor({ name: `Youtube Support`, iconURL: client.user.avatarURL() })
              .setDescription(`As of Recent Events We No Longer Support YouTube as a Supported Platform\nPlease Use Other Platforms Like Spotify, SoundCloud or Bandcamp\nIf You Have Any Questions or Query Join Our [Support Server](${Messages.Links.SupportLink})`)
            ], allowedMentions: { repliedUser: false }
          })
        }
      }
      handler = await FindQueue(client, guildId, message.message || message.ctx)//.catch((err) => {Logger.log(err, 'Error')});
      async function search(query: string) {
        const node = client.shoukaku.getIdealNode();
        const regex = /^https?:\/\//;
        let result: any;
        try {
          result = await node.rest.resolve(regex.test(query) ? query : `${Engine_}:${query}`);
        } catch (err) {
          return null;
        }
        return result;
      }



      const result = await search(searchQuery)
      const metadata: LavalinkResponse = result
      if (!result || !metadata) {
        const SearchError = new EmbedBuilder()
          .setColor(Messages.Mconfigs.color)
          .setDescription("No results found based on the title given for the song");
        message.reply({ embeds: [SearchError] });

      }

      if (metadata.loadType === LoadType.SEARCH || metadata.loadType === LoadType.TRACK) {
        if (metadata.data[0].info.length <= 61000) {
          const LoadFailed = new EmbedBuilder()
            .setColor(Messages.Mconfigs.color)
            .setDescription(Messages.Messages.LoadFailed);
          message.reply({ embeds: [LoadFailed] });
        }
      }

      if (handler.size && handler.playing ) {

        try {
          const AddEmbed = new EmbedBuilder()
            .setColor(Messages.Mconfigs.color)//Messages.Messages.songAdd + metadata.info.title
            .setDescription(`${message.channel?.permissionsFor(client.user).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.AddedPlus}` : `${EmojisPacket.Emojis.NormalEmojis.tick}`} Added [${metadata.data[0]?.info?.title?.substr(0, 40)}](${Messages.Links.SupportLink}) [${formatTime(metadata?.data[0]?.info?.length)}] To Queue`);
          if (handler?.player?.paused === true) { message.react('▶️') }
          switch (metadata.loadType) {
            case LoadType.TRACK:
              const x = await handler.push(metadata.data[0]).then(()=> {
                handler.playing = true;
                handler.player.setPaused(false).then(()=>{
                  handler.mainmsg.edit({ components: [Muzox_PauseCancelled, Muzox_Playing_SecondRow] })
                })
              });
              handler.playing = true;
              if (handler.size !== 1) {
                message.reply({ embeds: [AddEmbed] });
              }

              break;
            case LoadType.SEARCH:
              await handler.push(metadata.data[0]).then(()=> {
                handler.playing = true;
                handler.player.setPaused(false).then(()=>{
                  handler.mainmsg.edit({ components: [Muzox_PauseCancelled, Muzox_Playing_SecondRow] })
                })
              });
              if (handler.size !== 1) {
                message.reply({ embeds: [AddEmbed] });
              }


              break;
            case LoadType.PLAYLIST:
              handler.playing = true;
              for (const track of metadata.data.tracks) {
                const pl = await handler.push(track)
              }


              const PlaylistEmbed = new EmbedBuilder()
                .setColor(Messages.Mconfigs.color)
                .setDescription(`${EmojisPacket.Emojis.AddedPlus} Added ${metadata?.data?.tracks?.length} Songs From [${metadata?.data?.info?.name}](${Messages.Links.SupportLink})`);
              message.reply({ embeds: [PlaylistEmbed] }).then(()=> {
                handler.playing = true;
                handler.player.setPaused(false).then(()=>{
                  handler.mainmsg.edit({ components: [Muzox_PauseCancelled, Muzox_Playing_SecondRow] })
                })
              });
              break;


            case LoadType.EMPTY:
              const NoMatches = new EmbedBuilder()
                .setColor(Messages.Mconfigs.color)
                .setDescription(Messages.Messages.LoadFailed);
              message.reply({ embeds: [NoMatches] });
              break;
            case LoadType.ERROR:
              const LoadFailed = new EmbedBuilder()
                .setColor(Messages.Mconfigs.color)
                .setDescription(Messages.Messages.LoadFailed);
              message.reply({ embeds: [LoadFailed] });
              break;
          }
          // await handler.push(metadata)
        } catch (error) {
          // console.log(error)
        } finally {
          handler.playing = true;
        }
      } else {

        const AddEmbed = new EmbedBuilder()
          .setColor(Messages.Mconfigs.color)//Messages.Messages.songAdd + metadata.info.title
          .setDescription(`${message.channel?.permissionsFor(client.user).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.AddedPlus}` : `${EmojisPacket.Emojis.NormalEmojis.tick}`} Added [${metadata.data[0]?.info?.title?.substr(0, 40) || 'undefined'}](${Messages.Links.SupportLink}) [${formatTime(metadata?.data[0]?.info?.length || 0)}] To Queue`);
        if (handler?.player?.paused === true) { message.react('▶️') }

        switch (metadata.loadType) {
          case LoadType.TRACK:
            await handler.push(metadata.data[0])
            if (handler.size !== 1) {
              message.reply({ embeds: [AddEmbed] });
            }
            await handler.play(handler.tracks[0], message.channelId, message.author, message.ctx);
            break;
          case LoadType.SEARCH:
            await handler.push(metadata.data[0])
            if (handler.size !== 1) {
              message.reply({ embeds: [AddEmbed] });
            }
            await handler.play(handler.tracks[0], message.channelId, message.author, message.ctx);
            break;
          case LoadType.PLAYLIST:
            for (let i = 1; i < metadata.data.tracks.length; i++) {
              const track = metadata.data.tracks[i];
              await handler.push(track);
            }

            const PlaylistEmbed = new EmbedBuilder()
              .setColor(Messages.Mconfigs.color)
              .setDescription(`${EmojisPacket.Emojis.AddedPlus} Added ${metadata?.data?.tracks?.length} Songs From [${metadata?.data?.info?.name}](${Messages.Links.SupportLink})`);
            message.reply({ embeds: [PlaylistEmbed] })
            break;

          case LoadType.EMPTY:
            const NoMatches = new EmbedBuilder()
              .setColor(Messages.Mconfigs.color)
              .setDescription(Messages.Messages.LoadFailed);
            message.reply({ embeds: [NoMatches] });
            break;
          case LoadType.ERROR:
            const LoadFailed = new EmbedBuilder()
              .setColor(Messages.Mconfigs.color)
              .setDescription(Messages.Messages.LoadFailed);
            message.reply({ embeds: [LoadFailed] });
            break;
        }
        await handler.push(metadata)
        await handler.play(metadata, message.channelId, message.author, message.ctx);

      }





    } catch (e) {
      Logger.log(e, "Error")
    }
  }
}
