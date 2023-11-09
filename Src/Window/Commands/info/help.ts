import { ActionRowBuilder, ComponentType, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, EmojisPacket } from '../../../Resources/modules/index.js';
import { allButton } from "../../../Display/GlobalEmbeds/privateButtons.js";


const GETEmoji_Play_HEDanimated = EmojisPacket.Emojis.MusicHead
const SupportServerLink:any = Messages.Links.SupportLink
const InviteLinkURL : any = Messages.Links.InviteLink
const EMusicNote : any = EmojisPacket.Emojis.MusicNote
const EFilters : any = EmojisPacket.Emojis.Filters
const ESettings: any = EmojisPacket.Emojis.Settings
const EInfo : any = EmojisPacket.Emojis.Info
const EAllCommands : any = EmojisPacket.Emojis.darkdot
export default <messageCommands>{
  data: {
    name: 'help',
    description: 'Display all the available commands',
    aliases: ['h', 'madad'],
    vote: false,
    voice: false,
    queue: false,
    player: false,
    samevc: false,
    botconnection: false,
    permissions:['SendMessages','EmbedLinks'],
    slash: true,
    SlashData: {
        Name: 'help',
        options: []
      },
  },
  execute: async (client: Muzox, message: ContextManager, args: string[]) => {
    try{
      if(message.CheckInteraction){
        await message.setDeffered(false);
    }
    const Music_Commands_list = Messages.help.musiclist;
    const Filters_Commands_List = Messages.help.filterslist;
    const Configuration_Settings_Commands_List = Messages.help.settingslist
    const Information_Commands_List = Messages.help.infolist;
    const Playlist_Commands_List = Messages.help.playlistlist;
    const ABOUT = Messages.help.about;


    const regex = /`([^`]+)`/g;
    const CountM_ = Music_Commands_list.match(regex);
    const CountF_ = Filters_Commands_List.match(regex);
    const CountS_ = Configuration_Settings_Commands_List.match(regex);
    const CountI_ = Information_Commands_List.match(regex);
    const CountP_ = Playlist_Commands_List.match(regex);
    
    const CountM = CountM_ ? CountM_.length : 0 ;
    const CountF = CountF_ ? CountF_.length : 0;
    const CountS = CountS_ ? CountS_.length : 0;
    const CountI = CountI_ ? CountI_.length : 0;
    const CountP = CountP_ ? CountP_.length : 0;
  

    const select = new StringSelectMenuBuilder()
    .setCustomId('Main Page')
    .setPlaceholder('Select Here To Browse My Commands')
    .addOptions(
        new StringSelectMenuOptionBuilder()
            .setLabel('Music')
            .setEmoji('1112060668619800666')
            .setValue('Music'),
        new StringSelectMenuOptionBuilder()
            .setLabel('Filters')
            .setEmoji('1112060443377279046')
            .setValue('Filters'),
        new StringSelectMenuOptionBuilder()
            .setLabel('Utilities')
            .setEmoji('1112060933284581447')
            .setValue('information'),
            new StringSelectMenuOptionBuilder()
            .setLabel('Playlist')
            .setEmoji('1124725776470790274')
            .setValue('playlist'),
        new StringSelectMenuOptionBuilder()
            .setLabel('Configuration')
            .setEmoji('1112060241236988035')
            .setValue('settings'),
        new StringSelectMenuOptionBuilder()
            .setLabel('All Commands')
            .setEmoji('1112060350943203328')
            .setValue('All_Commands')
          
    );


    let prefix = (await client.prisma.prefixData.findUnique({
      where: {
        guildId: message.guild.id,
      },
    })) as any;
    if (!prefix) {
      prefix = client.config.Dprefix;
    } else {
      prefix = prefix.prefix;
    }
const row:any = new ActionRowBuilder() 
    .addComponents(select);
    const Page_Help_main = new EmbedBuilder()
    .setAuthor({ name: `${client.user.username} Help`, iconURL: client.user.displayAvatarURL() })
    .setThumbnail(message.client.user.displayAvatarURL())
    .setDescription(`_${ABOUT}_\n\n• My Default Prefix For This Server is \`${prefix}\``)
    .addFields({
      name  : 'Command Categories', value : `> ${EMusicNote} ** : Music**\n> ${EFilters} ** : Filters**\n> ${EmojisPacket.Emojis.Utilities} ** : Utilities**\n> ${EmojisPacket.Emojis.playlist} ** : Playlists**\n> ${EmojisPacket.Emojis.Settings} ** : Configuration**\n> ${EmojisPacket.Emojis.AllCommands} ** : All Commands**\n\n• Select Category From Below Menu`,
      inline: false
    })
    .setColor(Messages.Mconfigs.Ucolor)
    .setFooter({
      text: `Thanks For Choosing ${Messages.Messages.thanksforchoosingbotname}`,
      iconURL: message.guild.iconURL()
    })
    await message.reply({
        embeds: [Page_Help_main],
        components: [row, allButton],
    }).then((message)=> {

    const collector = message.createMessageComponentCollector({componentType: ComponentType.StringSelect})

      /************************************************************************************************************************************** */
      const All_Commands_Embed = new EmbedBuilder()

        .addFields(
          {name: `${EmojisPacket.Emojis.MusicNote} Music [${CountM}]`, value: `${Music_Commands_list}`, inline: false},
          {name: `${EmojisPacket.Emojis.Filters} Filters [${CountF}]`, value: `${Filters_Commands_List}`, inline: false},
          {name: `${EmojisPacket.Emojis.Utilities} Utilities [${CountI}]`, value: `${Information_Commands_List}`, inline: false},
          {name: `${EmojisPacket.Emojis.playlist} Playlist [${CountP}]`, value: `${Playlist_Commands_List}`, inline: false},
          {name: `${EmojisPacket.Emojis.Settings} Configuration Settings [${CountS}]`, value: `${Configuration_Settings_Commands_List}`, inline: false},
          )
        .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
        .setThumbnail(message.client.user.displayAvatarURL())
        .setColor(Messages.Mconfigs.color)
        .setFooter({
          text: `Thanks For Choosing ${Messages.Messages.thanksforchoosingbotname}`,
          iconURL: client.user.displayAvatarURL()
        })
      const Music_Embed = new EmbedBuilder()
        .setTitle(`${EmojisPacket.Emojis.MusicNote} Music [${CountM}]`)
        .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
        .setThumbnail(message.client.user.displayAvatarURL())
        .setDescription(`${Music_Commands_list}`)
        .setColor(Messages.Mconfigs.color)
        .setFooter({
          text: `Thanks For Choosing ${Messages.Messages.thanksforchoosingbotname}`,
          iconURL: client.user.displayAvatarURL()
        })
      const Filter_Embed = new EmbedBuilder()
        .setTitle(`${EmojisPacket.Emojis.Filters} Filters [${CountF}]`)
        .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
        .setThumbnail(message.client.user.displayAvatarURL())
        .setDescription(`${Filters_Commands_List}`)
        .setColor(Messages.Mconfigs.color)
        .setFooter({
          text: `Thanks For Choosing ${Messages.Messages.thanksforchoosingbotname}`,
          iconURL: client.user.displayAvatarURL()
        })
      const settings_Embed = new EmbedBuilder()
        .setTitle(`${EmojisPacket.Emojis.Settings} Settings [${CountS}]`)
        .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
        .setThumbnail(message.client.user.displayAvatarURL())
        .setDescription(`${Configuration_Settings_Commands_List}`)
        .setColor(Messages.Mconfigs.color)
        .setFooter({
          text: `Thanks For Choosing ${Messages.Messages.thanksforchoosingbotname}`,
          iconURL: client.user.displayAvatarURL()
        })
      const Info_Embed = new EmbedBuilder()
        .setTitle(`${EmojisPacket.Emojis.Utilities} Utilities [${CountI}]`)
        .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
        .setThumbnail(message.client.user.displayAvatarURL())
        .setDescription(`${Information_Commands_List}`)
        .setColor(Messages.Mconfigs.color)
        .setFooter({
          text: `Thanks For Choosing ${Messages.Messages.thanksforchoosingbotname}`,
          iconURL: client.user.displayAvatarURL()
        })
      const Playlist_Embed = new EmbedBuilder()
        .setTitle(`${EmojisPacket.Emojis.playlist} Playlist [${CountP}]\``)
        .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
        .setThumbnail(message.client.user.displayAvatarURL())
        .setDescription(`${Playlist_Commands_List}`)
        .setColor(Messages.Mconfigs.color)
        .setFooter({
          text: `Thanks For Choosing ${Messages.Messages.thanksforchoosingbotname}`,
          iconURL: client.user.displayAvatarURL()
        })
//Collector 
collector.on("collect", async (collected) => {
    const value = collected.values[0]
    if (value === "All_Commands") {
      collected.reply({ embeds: [All_Commands_Embed],
        components: [allButton],
         ephemeral: true })
    }
    if (value === "Music") {
        collected.reply({ embeds: [Music_Embed], ephemeral: true })
      }
      if (value === "Filters") {
        collected.reply({ embeds: [Filter_Embed], ephemeral: true })
      }
      if (value === "settings") {
        collected.reply({ embeds: [settings_Embed], ephemeral: true })
      }
      if (value === "information") {
        collected.reply({ embeds: [Info_Embed], ephemeral: true })
      }
      if (value === "playlist") {
        collected.reply({ embeds: [Playlist_Embed], ephemeral: true })
      }
  })
})
} catch(e){
  Logger.log(e,"Error")
}
  }
}