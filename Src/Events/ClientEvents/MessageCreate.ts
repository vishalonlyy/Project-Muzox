
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, PermissionFlagsBits, VoiceBasedChannel } from "discord.js";
import { NoPlayer, NotConnected, NothingInQueue, SameVc, musBeConnected, DevOnly, CommonEmbed } from "../../Display/GlobalEmbeds/privateEmbeds.js";
import { Queue, Messages, Muzox, Event, Logger, ContextManager, EmojisPacket } from "../../Resources/modules/index.js";
import util from "util";
import { allButton } from "../../Display/GlobalEmbeds/privateButtons.js";
import Topgg from '@top-gg/sdk'
export default class MessageCreate extends Event {
  constructor(client: Muzox, file: string) {
    super(client, file, {
      name:  'messageCreate',
    });
  }
  public async run(message: Message, client: Muzox): Promise<any> {
    let unhandledRejectionAdded = false;

    if (!unhandledRejectionAdded) {
      process.on('unhandledRejection', (reason, p) => {
        const message = `Unhandled Rejection: ${reason}`;
        const stackTrace = `Promise Stack Trace: ${util.inspect(p)}`;
       return //Logger.log(`${message}\n${stackTrace}`, "Error");
        
      });
      unhandledRejectionAdded = true;
    }
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
    
    
    if (message.author.bot) return;
    
    //Const / declarations 
    const mention: any = new RegExp(`^<@!?${this.client.user.id}>( |)$`);
    let premiumUser = await this.client.prisma.premiumUser.findUnique({
      where: {
        userId: message.author.id,
      },
    });
    let noprefixuser = await this.client.prisma.noprefix.findUnique({
      where: {
        userId: message.author.id,
      },
    });
      

    let prefix = (await this.client.prisma.prefixData.findUnique({
      where: {
        guildId: message.guildId,
      },
    })) as any;
    if (!prefix) {
      prefix = this.client.config.Dprefix;
    } else {
      prefix = prefix.prefix;
    }

    const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const mentionPrefix = `<@!?${this.client.user.id}>`;
    const prefixRegex = new RegExp(`^(${mentionPrefix}|${escapeRegex(prefix)})\\s*`);
    let args;
    if (premiumUser || noprefixuser ) {
      if (message.content.startsWith(mentionPrefix)) {
        args = [message.content.slice(mentionPrefix.length).trim()];
      } else if(prefixRegex.test(message.content)){
        const [matchedPrefix] = message.content.match(prefixRegex);
        args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
      } else {
        args = message.content.trim().split(/\s+/);
      }
    } else {
      const prefixRegex = new RegExp(`^(${mentionPrefix}|${escapeRegex(prefix)})\\s*`);
      if (!prefixRegex.test(message.content)) return;
    
      const [matchedPrefix] = message.content.match(prefixRegex);
      args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
    }
    const ctx = new ContextManager(message, args);

  //  console.log(prefixRegex)
   // console.log([matchedPrefix] + '----' + matchedPrefix)
    //console.log(args)
    const command_: string = args.shift().toLowerCase();
    const command = this.client.messageCommands.get(command_);
    const permissions = command?.data?.permissions 
    const memberid = message.member?.user.id;
    const botid: any = message.guild?.members.me?.id;
    const voiceState = message.guild?.voiceStates.cache.get(memberid);
    const guildId: any = message.guild?.id;

    const bvoiceState = message.guild?.voiceStates.cache.get(botid);
    const memberVoiceChannel : VoiceBasedChannel = voiceState?.channel;
    const botVoiceChannel = bvoiceState?.channel;
    const api = new Topgg.Api(this.client.config.TopGGApiKey);
    const hasVoted = await api.hasVoted(message.author.id).catch((e: any) => { });


    const node = this.client.shoukaku.getIdealNode();
    const player = node?.players.get(guildId)
    let queue: Queue = this.client.queue.get(guildId)
    if (this.client.mode.maintenance === true) {
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
      return message.reply({
        embeds: [maintenanceEmbed], components: [Nbuttons]
      })
    } else
    
       if (command?.data?.permissions) {
         if (!message.guild.members.me.permissions.has(permissions))
           return await message.reply({
             content: "I don't have enough permissions to execute this command.",
           }).catch(e=>Logger.log(e,"Error"))
         }



    if (message.content.match(mention)) {
      const mentionEmbed = new EmbedBuilder()
        .setAuthor({ name: `Settings For This Server`, iconURL: `${this.client.user.displayAvatarURL()}`, url: `${Messages.Links.SupportLink}` })
        .setThumbnail(this.client.user.displayAvatarURL())
        .setDescription(`• Prefix For This Server is \`${prefix}\`\n• Voice Region: \`${message?.guild?.members?.me?.voice?.channel?.rtcRegion ?? 'N/A'}\`\n• Server ID: \`${message.guild.id}\`\n\nYou can play music by joining a voice channel\nthen type \`${prefix}play\` song name or song links`)
        .setColor(Messages.Mconfigs.Ucolor)
        
      await message.reply({
        embeds: [mentionEmbed],
        components : [allButton]
      }).catch(e=>console.log(e))
    
    }
    
    let dm = message?.author?.dmChannel;
    if (typeof dm === 'undefined') dm = await message?.author?.createDM();
    if (
      !message.inGuild() ||
      !message.channel.permissionsFor(message.guild.members.me).has(PermissionFlagsBits.ViewChannel)
    )
      return;



      const PermissionEmbed = new EmbedBuilder()
      .setDescription(Messages.Error.Permission_SendMessage)
      .addFields({
      name: 'Guild', value: message.guild.name
      },{name: 'channel:', value:`<#${message.channelId}>`})
      
      
    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages))
    
      return await message.author.dmChannel
        .send({
          embeds:[PermissionEmbed]
        })
        .catch(() => { });

    
    if (!message.channel.permissionsFor(message.guild.members.me).has(PermissionFlagsBits.EmbedLinks)){
      //const missingPermissions = message.guild.members.me.permissionsIn(message.channel).missing(command?.data?.permissions).map(p => permissions[p]);
      return await message.reply({
        content: Messages.Error.Permission_EmbedLinks,
      }).catch(e=>Logger.log(e,"Error"))
    }

    if(command?.data?.permissions){
      if (!message.guild.members.me.permissions.has(command?.data?.permissions))
      return await message.reply({
        content: `I don't have enough permissions to execute this command. : ${command?.data?.permissions}`,
      }).catch(e=>Logger.log(e,"Error"))
    }
    //Main checks 
    if (!node) {
      console.log('No Connections [Nodes]')
    }
    //Message create checks
    if(!premiumUser && !this.client.config.devs.includes(message.author.id)){
      if(command?.data?.vote && !hasVoted){
      const voteE = new EmbedBuilder()
        .setAuthor({ name: `This Command Requires You To Vote`, iconURL: `${this.client.user.displayAvatarURL()}`, url: `${Messages.Links.VoteLink}` })
        .setColor(Messages.Mconfigs.Ucolor)
        .setDescription(`[Click Here](${Messages.Links.VoteLink}) To Vote & Use This Command For The Next 12 Hours`)
      return message.reply({ embeds: [voteE], components: [allButton] }).catch(e=>Logger.log(e,"Error"))
    }
    }
    
    if(command?.data.dev){
      //console.log('Dev command')
       const guildd: string | number | any = await this.client.guilds.fetch("936226552256036926");
       const sus: any = await guildd.members.fetch(message.author.id).catch((e: any) => { });
       const x = sus?.roles?.cache.has("1006174292062519317")
      if(!this.client.config.devs.includes(message.author.id) && !x ){
        return message.reply({
          embeds: [DevOnly]
        }).catch(e=>Logger.log(e,"Error"))
      }
    }
    //MUST BE CONNECTED :: USER NOT CONNECTED
    if (command?.data.voice && !voiceState?.channelId) {
      return message.reply({
        embeds: [musBeConnected.setDescription(`${message.channel.permissionsFor(message.guild.members.me).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.Wrong} ` : '🛑'} ${Messages.Error.UserNotConnected}`)]
      }).catch(e=>Logger.log(e,"Error"))
    }
    

    //If VC :: Full Err
      if(memberVoiceChannel?.full && memberVoiceChannel !== botVoiceChannel && command?.data?.Switches?.FullErr  ){
        return message.reply({
          embeds: [CommonEmbed.setDescription(`${message.channel.permissionsFor(message.guild.members.me).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.Wrong} ` : '🛑'} ${Messages.Error.VoiceChannelFull} ${memberVoiceChannel || ''}`)]
        }).catch(e=>Logger.log(e,"Error"))
      }
    
   //VC :: ViewAble
    if(!memberVoiceChannel?.viewable && memberVoiceChannel !== botVoiceChannel && command?.data?.Switches?.ViewErr){
      return message.reply({
        embeds: [CommonEmbed.setDescription(`${message.channel.permissionsFor(message.guild.members.me).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.Wrong} ` : '🛑'} ${Messages.Error.VoiceChannelNotViewable} ${memberVoiceChannel || ''}`)]
      }).catch(e=>Logger.log(e,"Error"))
    }
    
    if (command?.data?.queue && voiceState?.channelId) {
      if (!queue) {
        return message.reply({
          embeds: [NothingInQueue.setDescription(`${message.channel.permissionsFor(message.guild.members.me).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.Wrong} ` : '🛑'} ${Messages.Error.NothingInQueue}`)]
        }).catch(e=>Logger.log(e,"Error"))
      }
    }
    if (command?.data.player && voiceState?.channelId) {
      if (!player) {
        return message.reply({
          embeds: [NoPlayer.setDescription(`${message.channel.permissionsFor(message.guild.members.me).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.Wrong} ` : '🛑'} ${Messages.Error?.NoSongsInQueue}`)]
        }).catch(e=>Logger.log(e,"Error"))
      }
    }
    if(command?.data?.playing && voiceState?.channelId){
      if(!queue){
          return message.reply({
            embeds : [NoPlayer.setDescription(`${message.channel.permissionsFor(message.guild.members.me).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.Wrong} ` : '🛑'} ${Messages.Error?.NoSongsInQueue}`)]
          }).catch(e=>Logger.log(e,"Error"))
      }
    } 
    if (command?.data.botconnection) {
      if (!bvoiceState) {
        return message.reply({
          embeds: [NotConnected.setDescription(`${message.channel.permissionsFor(message.guild.members.me).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.Wrong} ` : '🛑'} ${Messages.Error.BotNotConnected}`)]
        }).catch(e=>Logger.log(e,"Error"))
      }
    }
    if (command?.data.samevc && voiceState?.channelId) {
      if (memberVoiceChannel !== botVoiceChannel) {
        return message.reply({
          embeds: [SameVc.setDescription(`${message.channel.permissionsFor(message.guild.members.me).has('UseExternalEmojis') ? `${EmojisPacket.Emojis.Wrong} ` : '🛑'} ${Messages.Error.notsameVC}`)]
        }).catch(e=>Logger.log(e,"Error"))
      }
    }
    if(command?.data.playlist){

    }

    if (!command) return Logger.log('Cmmd Not Found', 'Error');
    try {
      if (!message.guild.members.me.permissions.has('SendMessages')) {
        return console.log('no permission');
      } else {
        command.execute(this.client, ctx, args)
      }
    } catch (error) {
      console.log(error);
    }
    
    
  }
}