
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, PermissionFlagsBits, VoiceBasedChannel, VoiceChannel, VoiceState } from "discord.js";
import { NoPlayer, NotConnected, NothingInQueue, SameVc, musBeConnected, DevOnly, CommonEmbed } from "../../Display/GlobalEmbeds/privateEmbeds.js";
import { Queue, Messages, Muzox, Event, Logger, ContextManager } from "../../Resources/modules/index.js";
import util from "util";

import { ChannelType } from 'discord.js';

export default class VoiceStateUpdate extends Event {
  constructor(client: Muzox, file: string) {
    super(client, file, {
      name: 'voiceStateUpdate',
    });
  }

  private async wait(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  }

  public async run(oldState: VoiceState, newState: VoiceState, x: VoiceStateUpdate): Promise<any> {

    const guildId = newState.guild.id;
    if (!guildId) return;
    const player: Queue = this.client.queue.get(guildId);
    if (!player) return;
    if (!newState.guild.members.cache.get(this.client.user.id).voice.channelId) {
      try {
        Promise.all([
          player.mainmsg.delete().catch(e => { }),//(`playingsongmsg`).delete().catch(e => { })
          player.playing = false,
          player.clear(),
          player.previous = [],
          player.tracks = [],
          player.player.destroyPlayer(),
          this.client.shoukaku.leaveVoiceChannel(guildId).catch(e=>{})
        ])
        // player.mainmsg.delete().catch(e => { })//(`playingsongmsg`).delete().catch(e => { })
        // player.playing = false
        // player.clear()
        // player.player.destroyPlayer();
        // this.client.shoukaku.leaveVoiceChannel(guildId).catch(e=>{})
      } catch (e) {
        player.player.destroyPlayer();
        this.client.shoukaku.leaveVoiceChannel(guildId).catch(e=>{})

      } player.player.destroyPlayer();

      const stagechannel = newState.guild.channels.cache.get(newState.channel?.id ?? newState.channelId);

      if (newState.id === this.client.user.id && ChannelType.GuildStageVoice) {
        if (!oldState.channelId) {
          try {
            await newState.guild.members.me.voice.setSuppressed(false).then(() => { });
          } catch (err) {
            if (player) {
              player.player.setPaused(true);
              player.playing = false;

              // client.resume(client, player)
            }
          }
        } else if (oldState.suppress !== newState.suppress) {
          try {
            await newState.guild.members.me.voice.setSuppressed(false).then(() => { });
          } catch (err) {
            if (player) {
              player.player.setPaused(false);
              player.playing = false;
            }
          }
        }
      }


     if (oldState.id === this.client.user.id) return
	if (!oldState.guild.members.cache.get(this.client.user.id).voice.channelId) return
	const vcDontleaveSchema = this.client.prisma.twentyFourBySevenData;
	const isactivated = await vcDontleaveSchema.findFirst({ where: { guildId: oldState.guild.id , status : true} });

	if (!isactivated) {

		// Make sure the bot is in the voice channel that 'activated' the event
		if (oldState.guild.members.cache.get(this.client.user.id).voice.channelId === oldState.channelId) {
			if (
				oldState.guild.members.me.voice?.channel &&
				oldState.guild.members.me.voice.channel.members.filter((m) => !m.user.bot).size >= 0
			) {
        console.log("state manager triggered ")
        
				await this.wait(2000)
				// times up check if bot is still by themselves in VC (exluding bots)
				const vcMembers = oldState.guild.members.me.voice.channel?.members.filter(member => !member.user.bot).size
				if (player.playing === false) {
					if (!player) return;
          await player.player.destroyPlayer()
					const embed = new EmbedBuilder()
						.setColor(Messages.Mconfigs.Ucolor)
						.setAuthor({name : 'Player Destroyed', iconURL : this.client.user.displayAvatarURL(), url : `${Messages.Links.SupportLink}`})
						.setDescription(`I Left The Voice Channel Because I Was Inactive For Too long\nYou Can Disable This By Enabling My [247](${Messages.Links.VoteLink}) Mode Easily`)
					try {
						const c : any = this.client.channels.cache.get('1134766774563373106')//this.client.queue..cache.get(player.textChannel)
						if (c)
						await	c.send({ embeds: [embed] })
					} catch (err) {

					}

				}
			}
		}
	} else {
		return;
	}




      
    }
  }

  
}