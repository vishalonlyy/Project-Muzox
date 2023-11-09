import { Message, CommandInteraction, EmbedBuilder } from "discord.js";
import { Muzox_Playing_FirstRow, Muzox_Playing_SecondRow, Muzox_PauseClicked, Muzox_StopClicked, Muzox_PauseCancelled, Muzox_ShuffleClicked, Muzox_LoopClicked, Muzox_LoopCancelled, FourPageSwitchButtons } from "../../../Display/GlobalEmbeds/privateButtons.js";
import { CommonEmbed } from "../../../Display/GlobalEmbeds/privateEmbeds.js";
import { formatTime, Messages, EmojisPacket, Logger } from "../../../Resources/modules/index.js";
import Queue from "../../Queue.js";
import { Track } from "shoukaku";
import GeneratePlaylistString from "../../../Display/Utils/generatePlaylistString.js";

export default async function PlayerStarted(x: Queue) {
  const Db = x.client.prisma.guildData;
  let EnabledButtons: boolean = true
  const check = await Db.findFirst({
    where: {
      guildId: x.CTX.guildId,
    }
  })
  if (check && check.NpButtons === false) {
    EnabledButtons = false;
  }

  x.playing = true;
  const voiceState = x.CTX.guild?.voiceStates.cache.get(x.CTX.member.user.id);
  const channelId: any = voiceState?.channelId;
  let collector: any = null;
  let messenger_: Message | CommandInteraction = null;
  let instanceMSG: Message | any = null;
  let duration: any = x.currentTimeLeft ? formatTime(x.currentTimeLeft) : null;
  let secondManagingDuration = x.tracks[0].info.length ? formatTime(x.tracks[0].info.length) : null;
  let Title = x.currentTrackTitle?.substr(0, 20) || x.tracks[0].info.title?.substr(0, 20) || null;
  let Author = x.currentTrackAuthor || x.tracks[0].info.author || null;
  let Requester = x.Requester || null;
  let requester = x.requester || null;


  if (duration === null) {
    duration = secondManagingDuration || '00:00';

  } else if (secondManagingDuration === null) {
    secondManagingDuration = duration || '00:00';
  }

  if (Title === null) {
    Title = 'Err :: Muzox Support';
  } else if (Author === null) {
    Author = 'no author';
  } else if (Requester === null) {
    Requester = 'no requester';
  } else if (requester === null) {
    requester = 'no requester';
  }

  const StartEmbed = new EmbedBuilder()
    .setColor(Messages.Mconfigs.color)
    .setAuthor({ name: `${Messages.Title.NowPlaying}`, iconURL: x.client.user.displayAvatarURL(), url: Messages.Links.SupportLink })
    .setDescription(`[${Title}](${Messages.Links.SupportLink})・[${duration || secondManagingDuration}]`);

  const StopEmbed = new EmbedBuilder()
    .setColor(Messages.Mconfigs.Ucolor)
    .setAuthor({ name: `${Messages.Title.PlayerStopped}`, iconURL: x.client.user.displayAvatarURL(), url: Messages.Links.SupportLink })
    .setDescription(`Requested By ${requester}`)

  if (x.CTX instanceof Message) {
    try {
      if (EnabledButtons === true || !check) {
        messenger_ = await x.CTX.channel.send({
          embeds: [StartEmbed],
          components: [Muzox_Playing_FirstRow, Muzox_Playing_SecondRow]
        }).then(msg => x.mainmsg = msg)
        instanceMSG = messenger_;
      } else {
        messenger_ = await x.CTX.channel.send({
          embeds: [StartEmbed]
        }).then(msg => x.mainmsg = msg)
        instanceMSG = messenger_;
      }
    } catch (e) {
      try {
        messenger_ = await x.CTX.channel.send({
          embeds: [StartEmbed]
        }).then(msg => x.mainmsg = msg)
        instanceMSG = messenger_;
      } catch (e) { await x.CTX.channel.send({ content: `Unexpected Error Occured While Sending The Embed. Please Try Again Later or Try to Enable Buttons.` }) }
    }


  } else {
    try {
      if (EnabledButtons === true) {

        messenger_ = await x.CTX.editReply({
          embeds: [StartEmbed],
          components: [Muzox_Playing_FirstRow, Muzox_Playing_SecondRow]
        }).then(msg => x.mainmsg = msg)
        instanceMSG = await x.CTX.fetchReply();
      } else {
        messenger_ = await x.CTX.editReply({
          embeds: [StartEmbed]
        }).then(msg => x.mainmsg = msg)
        instanceMSG = await x.CTX.fetchReply();
      }
    } catch (e) {
      try {
        messenger_ = await x.CTX.editReply({
          embeds: [StartEmbed]
        }).then(msg => x.mainmsg = msg)
        instanceMSG = await x.CTX.fetchReply();
      } catch (e) { await x.CTX.editReply({ content: `Unexpected Error Occured While Sending The Embed. Please Try Again Later or Try to Enable Buttons.` }) }
    }

  }



  if (instanceMSG) {
    if (collector && !collector.ended) {
      collector.stop('Starting a new collector');
    }
    collector = instanceMSG.createMessageComponentCollector({
      filter: (b) => {
        if (b.guild.members.me.voice.channel && b.guild.members.me.voice.channelId === channelId) return true;
        else {
          let z = b.guild.members.me.voice.channel;
          if (z === null) return z = 'Voice Channel';
          b.reply({
            content: `You are not connected to ${b.guild.members.me.voice.channel} to use this buttons.`,
            ephemeral: true
          }); return false;
        };
      },
      time: x.currentTrack.info.length,
    });

    collector.on("collect", async (i) => {

      if (i.customId === "pause") {
        x.player.setPaused(true);
        await i.update({
          components: [Muzox_PauseClicked, Muzox_Playing_SecondRow],
          // embeds: [paused_embed]
        })
      } else if (i.customId === "stop") {
        i.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(Messages.Mconfigs.color)
              .setDescription(`${EmojisPacket.Emojis.TracKStart.stop} **Player Stoped**`)
              .setFooter({ text: `Requested By ${i.user.username || 'Null'}` })
          ]
        }).then(() => {
          Promise.all([
            x.player.stopTrack(),
            x.playing = false,
            x.clear(),

          ]).then(() => {
            collector.stop('Stopped the collector cause player stopped');

            i.update({
              components: [Muzox_StopClicked, Muzox_Playing_SecondRow],
              // embeds: [StopEmbed]
            }).then(() => {
              setTimeout(() => {
                i.deleteReply()
              }, 5000)
            })
          }).catch((error) => {
            console.error(error);
          });
        })


      } else if (i.customId === "resume1") {
        x.player.setPaused(false)
        await i.update({
          components: [Muzox_PauseCancelled, Muzox_Playing_SecondRow],
          embeds: [StartEmbed]
        })
      } else if (i.customId === "backward") {
        x.rewind();
        await i.update({
          components: [Muzox_Playing_FirstRow, Muzox_Playing_SecondRow],
        }).then(async () => {
          const position = formatTime(x.player.position);
          await i.channel.send({
            ephermeral: true,
            embeds: [CommonEmbed.setDescription(`${Messages.Messages.RewindDeafult + formatTime(x.player.position) ?? '00:00'}`)]
          }).then((msg) => {
            setTimeout(() => {
              msg.delete()
            }, 5000)
          })
        })

      } else if (i.customId === "forward") {
        x.forward();
        await i.update({
          components: [Muzox_Playing_FirstRow, Muzox_Playing_SecondRow],
        }).then(async () => {
          await i.channel.send({
            ephermeral: true,
            embeds: [CommonEmbed.setDescription(`${Messages.Messages.ForwardDeafult + formatTime(x.player.position)}`)]
          }).then((msg) => {
            setTimeout(() => {
              msg.delete()
            }, 5000)
          })

        })
      } else if (i.customId === "shuffle") {
        x.shuffleManager();
        await i.update({
          components: [Muzox_Playing_FirstRow, Muzox_ShuffleClicked],
          //embeds: [CommonEmbed.setDescription(`${Messages.Messages.ShuffleDeafult}`)]
        }).then(async () => {
          await i.channel.send({
            ephermeral: true,
            embeds: [CommonEmbed.setDescription(`${Messages.Messages.ShuffleDeafult}`)]
          }).then((msg) => {
            setTimeout(() => {
              msg.delete()
            }, 5000)
          })
        })
      } else if (i.customId === "shuffle_cancel") {
        x.shuffleManager(); {
          await i.update({
            components: [Muzox_Playing_FirstRow, Muzox_Playing_SecondRow],
            //embeds: [CommonEmbed.setDescription(`${Messages.Messages.ShuffleDeafult}`)]
          }).then(async () => {
            await i.channel.send({
              ephermeral: true,
              embeds: [CommonEmbed.setDescription(`${Messages.Messages.ShuffleDeafult}`)]
            }).then((msg) => {
              setTimeout(() => {
                msg.delete()
              }, 5000)
            })
          })
        }

      } else if (i.customId === "next") {
        try {
          x.skip().then(() => x.eventEmitter.emit('TQemitter'))
            .catch(async (error) => {

            })
        } catch (error) {
          await i.update({
            components: [Muzox_Playing_FirstRow, Muzox_Playing_SecondRow],
            embeds: [CommonEmbed.setDescription(`${Messages.Error.Support}`)]
          })
        } finally {
          collector.stop('Stopped the collector cause player stopped')
        }
        await i.update({
          components: [Muzox_Playing_FirstRow, Muzox_Playing_SecondRow],

        }).then(async () => {
          await x.mainmsg.reply({
            ephermeral: true,
            embeds: [CommonEmbed.setDescription(`${Messages.Messages.SkipDeafult + x.currentTrack.info.title ?? 'No Songs Left'}`)]
          }).then((msg) => {
            setTimeout(() => {
              msg.delete()
            }, 5000)
          })
        })
      } else if (i.customId === 'previous') {
        const channel = x.CTX.guild?.channels.cache.get(x.AnnouncementChannel);
        const noPreviousEmbed = new EmbedBuilder()
          .setColor(Messages.Mconfigs.color)
          .setDescription(`${channel.permissionsFor(x.client.user).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.Wrong}` : `${EmojisPacket.Emojis.NormalEmojis.Wrong}`} There is No Previous Tracks in The Queue To Play`)
        if (x.previous.length === 0) return i.reply({ ephemeral: true, embeds: [noPreviousEmbed] })
        x.previousTrack();
        await i.update({
          components: [Muzox_Playing_FirstRow, Muzox_Playing_SecondRow],

        }).then(async () => {

          await i.channel.send({
            ephermeral: true,
            embeds: [CommonEmbed.setDescription(`${Messages.Messages.PreviousDeafult + x.previous[0]?.info.title ?? 'No Songs Left'}`)]
          }).then((msg) => {
            setTimeout(() => {
              msg.delete()
            }, 5000)
          })
        })

      } else if (i.customId === 'repeat') {

        const l: 0 | 1 | 2 | any = await x.loopManager();
        const channel = x.CTX.guild?.channels.cache.get(x.AnnouncementChannel);
        let Message = `${channel.permissionsFor(x.client.user).has("UseExternalEmojis") ? `${l !== 0 ? EmojisPacket.Emojis.TracKStart.loop : EmojisPacket.Emojis.Wrong}` : `${l === 0 ? EmojisPacket.Emojis.NormalEmojis.Loop : EmojisPacket.Emojis.NormalEmojis.Wrong}`} ${l !== 0 ? `${Messages.Messages.LoopEnabled} **${l === 1 ? "Track" : l === 2 ? "Queue" : "Disabled"}**` : `${Messages.Messages.LoopDisabled}`} `;
        await i.update({
          components: [Muzox_Playing_FirstRow, Muzox_LoopClicked],

        }).then(async () => {
          await i.channel.send({
            ephermeral: true,
            embeds: [CommonEmbed.
              setDescription(`${Message}`)
              //.setFooter({ text: `Loop is ${x.loop ? 'enabled' : 'disabled'}` })
            ]
          }).then((msg) => {
            setTimeout(() => {
              msg.delete()
            }, 5000)
          })
        })


      } else if (i.customId === "repeat_cancel") {
        const l: 0 | 1 | 2 | any = await x.loopManager();
        const channel = x.CTX.guild?.channels.cache.get(x.AnnouncementChannel);
        let Message = `${channel.permissionsFor(x.client.user).has("UseExternalEmojis") ? `${l !== 0 ? EmojisPacket.Emojis.TracKStart.loop : EmojisPacket.Emojis.Wrong}` : `${l === 0 ? EmojisPacket.Emojis.NormalEmojis.Loop : EmojisPacket.Emojis.NormalEmojis.Wrong}`} ${l !== 0 ? `${Messages.Messages.LoopEnabled} **${l === 1 ? "Track" : l === 2 ? "Queue" : "Disabled"}**` : `${Messages.Messages.LoopDisabled}`} `;
        await i.update({
          components: [Muzox_Playing_FirstRow, Muzox_LoopCancelled],

        }).then(async () => {
          await i.channel.send({
            ephermeral: true,
            embeds: [CommonEmbed.setDescription(`${Message}`)//.setFooter({ text: `Loop is ${x.loop ? 'enabled' : 'disabled'}` })
            ]
          }).then((msg) => {
            setTimeout(() => {
              msg.delete()
            }, 5000)
          })
        })
      } else if (i.customId === "queue") {
        //const queue: Queue = this.client.queue.get(x.CTX.guildId);
        if (!x) {
          const embed = new EmbedBuilder()
            .setDescription(Messages.Error.NoSongsInQueue)
            .setColor(Messages.Mconfigs.Ecolor)
          return i.reply({ embeds: [embed], ephemeral: true }).catch(e => { })
        }
        let queue_ = x.tracks
          .slice(1, -1)
          .map((track: Track, index) =>
            `(${index + 1})・[${track?.info?.title || 'undefined'}](${Messages.Links.SupportLink})・[${track?.info?.isStream ? 'LIVE' : formatTime(track?.info?.length || 0)
            }]`
          );

        if (queue_.length === 0) {
          queue_ = [`${Messages.Error.NoSongsInQueue}`];
        }
        const pages = queue_.reduce((resultArray, item, index) => {
          const chunkIndex = Math.floor(index / 10)
          if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []
          }
          resultArray[chunkIndex].push(item)
          return resultArray
        }, [])
        const embeds = pages.map((page, index) => {
          const embed = new EmbedBuilder()
            .setAuthor({ name: `Music Queue`, iconURL: x.client.user?.displayAvatarURL(), url: Messages.Links.SupportLink })
            .setThumbnail(x.CTX.guild?.iconURL())
            // .setTitle(`Tracks Loaded`)
            .setDescription(`${EmojisPacket.Emojis.VolumeUp} Now Playing:\n [${x.currentTrackTitle?.substr(0, 40) || x.tracks[0].info.title?.substr(0, 40) || null}](${Messages.Links.SupportLink}) - [${formatTime(x?.currentTimeLeft)} Left]\n\n `
              + `${EmojisPacket.Emojis.TracKStart.queue} Upcoming Songs\n` + `${page.join('\n')}`)
            .setColor(Messages.Mconfigs.Ucolor)
            .setFooter(
              { text: `Page ${index + 1}/${pages.length} | Track's in Queue: ${x.tracks.length} `, iconURL: x.client?.user?.displayAvatarURL() }
            )
          return embed
        })
        let message_: any;
        let collector_: any = null;
        if (pages.length > 1) {
          message_ = await i.reply({
            embeds: [embeds[0]],
            ephemeral: true,
            components: [FourPageSwitchButtons]
          }).then((i) => {
            collector_ = i.createMessageComponentCollector({
              filter: (x_) => x_.user.id === x.author.id,
              time: 60000
            }).catch(e => Logger.log(e, 'Error'))
          })
        } else {
          message_ = await i.reply({
            embeds: [embeds[0]],
            ephemeral: true,
            //components: [FourPageSwitchButtons]
          })
          collector_ = message_.createMessageComponentCollector({
            filter: (x_) => x_.user.id === x.author.id,
            time: 60000
          }).catch(e => Logger.log(e, 'Error'))
          // console.log(collector_)

        }

        //const 
        let currentIndex = 0
        collector_.on('collect', async (x_) => {
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
          } else if (x_.customId === 'Tnext') {
            currentIndex = embeds.length - 1;
            if (currentIndex >= embeds.length) {
              currentIndex = embeds.length - 1
            }
          } else if (x_.customId === 'Tprevious') {
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
        collector_.on('end', async () => {
          await message_.edit({
            embeds: [embeds[currentIndex]],
            components: [FourPageSwitchButtons]
          })
        })

      } else if (i.customId === "like") {
        let messageI: '0' | '1'
        async function LikeTrack(x: Queue, z) {
          let playlists ;
          const finduser = await x.client.prisma.user.findUnique({ where: { userId: z.user.id } });
          if(finduser){
              playlists = await x.client.prisma.user
            .findUnique({ where: { userId: z.user.id } })
            .playlists();
          
          } else {
            await x.client.prisma.user.create({
              data:{
                userId: z.user.id,
                Badges: []
              } 
            }).then(async () => {
              playlists = await x.client.prisma.user
              .findUnique({ where: { userId: z.user.id } })
              .playlists();
            }).catch((e) => {
              Logger.log(e, "Error")
            })
          }
         
          const favPlaylist = await x.client.prisma.playlist.findUnique({ where: { userId: z.user.id, name: "Favorites" } })

          const PlaylistUrl = GeneratePlaylistString(22);
          const song = x.currentTrackTitle;
          if (favPlaylist) {
            const zplaylist = await playlists.find((x) => x.name === "Favorites");
            if (zplaylist.songs.includes(song)) {
              const newSongs = [...favPlaylist.songs],
                index = newSongs.indexOf(song);
              if (index > -1) {
                newSongs.splice(index, 1);
              }
              await x.client.prisma.playlist.update({
                where: {
                  id: favPlaylist.id
                }, data: { songs: newSongs }
              }).then(async () => {
                messageI = '0';
              }).catch((e) => {
                Logger.log(e, "Error")
              })
            }

            else {
              await x.client.prisma.playlist.update({
                where: {
                  id: favPlaylist.id
                }, data: { songs: { push: song } }
              }).then(async () => {
                messageI = '1';
              }).catch((e) => {
                Logger.log(e, "Error")
              })
            }

          } else {
            await x.client.prisma.playlist.create({
              data: {
                userId: z.user.id,
                name: "Favorites",
                songs: [`${Date.now()}`],
                Url: PlaylistUrl
              }
            }).then(async () => {

              const favPlaylist = await playlists.find((x) => x.name === "Favorites");
              await x.client.prisma.playlist.update({
                where: {
                  id: favPlaylist.id
                }, data: { songs: { push: song } }
              })
            }).then(async () => {
              messageI = '1';
            }).catch((e) => {
              Logger.log(e, "Error")
            })
          }
        }



        const LikeFunction: any = await LikeTrack(x, i).catch((e) => { Logger.log(e, "Error") })
        const channel = x.CTX.guild?.channels.cache.get(x.AnnouncementChannel);
        const message = `${channel?.permissionsFor(x.client.user).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.TracKStart.like}` : `${EmojisPacket.Emojis.NormalEmojis.Like}`} ${messageI === "1" ? "Added" : "Removed"} [${x.currentTrackTitle.substr(0, 40)}](${Messages.Links.SupportLink}) ${messageI === "1" ? "To" : "From"} Favourite List`;

        await i.update({
          components: [Muzox_Playing_FirstRow, Muzox_Playing_SecondRow],
        }).then(async () => {

          Promise.resolve(i.channel.send({
            ephermeral: true,
            embeds: [CommonEmbed.setDescription(`${message}`)]
          })).then((msg) => {
            setTimeout(() => {
              msg.delete()
            }, 10000)
          }).catch((e) => { Logger.log(e, "Error") })

        })

      }
    });

    collector.on("end", async (collected, reason) => {
      collector = null;
    })


  }
  //x.emit('trackStart');    
}