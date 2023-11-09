
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, CommandInteraction, EmbedBuilder, Interaction, PermissionFlagsBits } from "discord.js";
import { Queue, Messages, Muzox, Event, messageCommands, ContextManager, Logger, EmojisPacket } from "../../Resources/modules/index.js";
import { CommonEmbed, NoPlayer, NotConnected, NothingInQueue, SameVc, musBeConnected } from "../../Display/GlobalEmbeds/privateEmbeds.js";
import config from "../../config.js";
import util from "util";
import Topgg from "@top-gg/sdk";
import { allButton } from "../../Display/GlobalEmbeds/privateButtons.js";

export default class InteractionCreate extends Event {
  constructor(client: Muzox, file: string) {
    super(client, file, {
      name: 'interactionCreate',
    });
  }
  public async run(interaction: CommandInteraction, client: Muzox, x: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.member?.user?.id) return null;
    if (!interaction.isCommand()) return;

    const ctx = new ContextManager(interaction, null);

    process.on('unhandledRejection', (reason, p) => {
      const message = `Unhandled Rejection: ${reason}`;
      const stackTrace = `Promise Stack Trace: ${util.inspect(p)}`;
      return //Logger.log(`${message}\n${stackTrace}`, "Error");

    });


    process.on('uncaughtException', (err, origin) => {
      const message = `Uncaught Exception: ${err}`;
      const stackTrace = `Exception Stack Trace: ${util.inspect(origin)}`;
      return //Logger.log(`${message}\n${stackTrace}`, "Error");
    });

    process.on('uncaughtExceptionMonitor', (err, origin) => {
      const message = `Uncaught Exception Monitor: ${err}`;
      const stackTrace = `Exception Monitor Stack Trace: ${util.inspect(origin)}`;
      return //Logger.log(`${message}\n${stackTrace}`, "Error");
    });
    const node = this.client.shoukaku.getIdealNode();
    const memberid = interaction?.member?.user?.id;
    const botid: any = interaction.guild?.members.me?.id;
    const voiceState = interaction.guild?.voiceStates.cache.get(memberid);
    const guildId: any = interaction.guild?.id;
    const queue = this.client.queue.get(guildId)

    //:Queue = await getQueue(client,guildId,interaction)

    const player = node?.players.get(guildId)
    const bvoiceState = interaction.guild?.voiceStates.cache.get(botid);
    const memberVoiceChannel = voiceState?.channel;
    const botVoiceChannel = bvoiceState?.channel;
    const api = new Topgg.Api(this.client.config.TopGGApiKey);
    const hasVoted = await api.hasVoted(memberid)


    let premiumUser = await this.client.prisma.premiumUser.findUnique({
      where: {
        userId: memberid,
      },
    });

    if (this.client.mode.maintenance === true) {
      await interaction.deferReply()
      const Nbuttons = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setURL(Messages.Links.SupportLink)
            .setLabel('Support')
            .setStyle(ButtonStyle.Link)
        ) as any
      const maintenanceEmbed = new EmbedBuilder()
        .setTitle('Down for Maintenance')
        .setDescription(`${this.client.user.username} is currently in maintenance mode \n more info [Join Support](${Messages.Links.SupportLink})`)
        .addFields({
          name: 'Reason', value: `${this.client.mode.reason}`
        })
        .setColor(Messages.Mconfigs.Ecolor)

        .setFooter({ text: `estimated: ${this.client.mode.estimation}`, iconURL: `${this.client.user.avatarURL()}` });
      await interaction.reply({
        embeds: [maintenanceEmbed], components: [Nbuttons]
      })
    } else


      if (!node) {
        console.log('No Connections [Nodes]')
      }
    //Value




    //Check If Command name is Present Else Return Error
    const command: messageCommands = this.client.messageCommands.get(interaction.commandName);
    if (!command) {
      console.log("One of the commands is missing a name");
      return;
    }



    /// Error Senders
    const voiceCheck = interaction.options.get('voice');

    if (command?.data.vote && !hasVoted && !premiumUser && !this.client.config.devs.includes(memberid)) {
      const voteE = new EmbedBuilder()
        .setAuthor({ name: `This Command Requires You To Vote`, iconURL: `${this.client.user.displayAvatarURL()}`, url: `${Messages.Links.VoteLink}` })
        .setColor(Messages.Mconfigs.Ucolor)
        .setDescription(`[Click Here](${Messages.Links.VoteLink}) To Vote & Use This Command For The Next 12 Hours`)
      await interaction.reply({ embeds: [voteE], components: [allButton] })
        .catch(e => Logger.log(e, "Error"))
    }

    if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.EmbedLinks)) {
      //const missingPermissions = message.guild.members.me.permissionsIn(message.channel).missing(command?.data?.permissions).map(p => permissions[p]);
      await interaction.reply({
        content: Messages.Error.Permission_EmbedLinks,
      }).catch(e => Logger.log(e, "Error"))
    }

    if (command?.data?.permissions) {
      if (!interaction.guild.members.me.permissions.has(command?.data?.permissions))
        await interaction.reply({
          content: `I don't have enough permissions to execute this command. : ${command?.data?.permissions}`,
        }).catch(e => Logger.log(e, "Error"))
    }

    if (command?.data?.voice && !voiceState?.channelId) {
      await interaction.reply({
        embeds: [musBeConnected.setDescription(`${interaction.channel.permissionsFor(interaction.guild.members.me).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.Wrong} ` : '🛑'} ${Messages.Error.UserNotConnected}`)]
      });
    }

    if (voiceCheck) {
      // Check if user is in a voice channel
      const memberid: any = interaction.member.user?.id;
      const voiceState = interaction.guild?.voiceStates.cache.get(memberid);
      if (!voiceState?.channelId) {
        await interaction.reply({
          embeds: [CommonEmbed.setDescription(`${interaction.channel.permissionsFor(interaction.guild.members.me).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.Wrong} ` : '🛑'} ${Messages.Error.UserNotConnected}`)]
        });
      } else {
        return null;
      }
    }

    //Check :: Same Voice Channel :::: User & Bot
    if (command?.data?.samevc && voiceState?.channelId) {
      if (memberVoiceChannel !== botVoiceChannel) {
        await interaction.reply({
          embeds: [SameVc.setDescription(`${interaction.channel.permissionsFor(interaction.guild.members.me).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.Wrong} ` : '🛑'} ${Messages.Error.notsameVC}`)]
        })
      }
    }
    //Check :: User's Voice Channel FULL
    if (memberVoiceChannel?.full) {
      await interaction.reply({
        embeds: [CommonEmbed.setDescription(`${interaction.channel.permissionsFor(interaction.guild.members.me).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.Wrong} ` : '🛑'} ${Messages.Error.VoiceChannelFull} ${memberVoiceChannel || ''}`)]
      }).catch(e => Logger.log(e, "Error"))
    }
    //Check :: User's Voice Channel NOT VIEWABLE
    if (voiceState?.channelId) {
      if (!memberVoiceChannel?.viewable && !memberVoiceChannel?.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ViewChannel) 
      && command?.data?.Switches?.ViewErr) {
        await interaction.reply({
          embeds: [CommonEmbed.setDescription(`${interaction.channel.permissionsFor(interaction.guild.members.me).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.Wrong} ` : '🛑'} ${Messages.Error.VoiceChannelNotViewable} ${memberVoiceChannel || ''}`)]
        }).catch(e => Logger.log(e, "Error"))
      }

    }
    //Check :: Bot Player is NOT in a Voice Channel
    if (command?.data?.player && voiceState?.channelId) {
      if (!player) {
        await interaction.reply({
          embeds: [NoPlayer.setDescription(`${interaction.channel.permissionsFor(interaction.guild.members.me).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.Wrong} ` : '🛑'} ${Messages.Error.NothingInQueue}`)]
        })
      }
    }
    if (command?.data?.queue && voiceState?.channelId) {
      if (!queue.size) {
        await interaction.reply({
          embeds: [NothingInQueue.setDescription(`${interaction.channel.permissionsFor(interaction.guild.members.me).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.Wrong} ` : '🛑'} ${Messages.Error.NothingInQueue}`)]
        })
      }
    }

    if (command?.data?.dev) {
      if (!config.devs.includes(memberid)) {
        // console.log(config.devs)
        await interaction.reply({
          content: 'Only owners / Devs have acess to these commands ', ephemeral: true
        })

      }
    }
    if (command?.data?.botconnection) {
      if (!bvoiceState) {
        await interaction.reply({
          embeds: [NotConnected.setDescription(`${interaction.channel.permissionsFor(interaction.guild.members.me).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.Wrong} ` : '🛑'} ${Messages.Error.BotNotConnected}`)]
        })
      }
    }
    try {
      await command.execute(this.client, ctx, null, interaction);
    } catch (e) {
      // console.log(e)
      if (interaction.replied)
        interaction.followUp("Some error occurred while running the command");
      else
        interaction.reply("Some error occurred");
    }
  }
}
