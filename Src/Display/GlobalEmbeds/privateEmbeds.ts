import { EmbedBuilder, Message } from "discord.js";
import { Messages } from "../../Resources/modules/index.js";

//.setFooter({text: `Thanks for selecting ${Muzox_Client.user.username}`})

const musBeConnected = new EmbedBuilder()
.setColor(Messages.Mconfigs.Ecolor)

const CommonEmbed = new EmbedBuilder()
.setColor(Messages.Mconfigs.color)

const SameVc = new EmbedBuilder()
.setColor(Messages.Mconfigs.Ecolor)

const NothingInQueue = new EmbedBuilder()
.setColor(Messages.Mconfigs.Ecolor)

const NoPlayer = new EmbedBuilder()
.setColor(Messages.Mconfigs.Ecolor)

const NotConnected = new EmbedBuilder()
.setColor(Messages.Mconfigs.Ecolor)

const DevOnly = new EmbedBuilder()
.setDescription(`This command is only for developers`)
.setColor(Messages.Mconfigs.Ecolor)


const PlaylistNameERR = new EmbedBuilder()
.setDescription(`Playlist name should be less than 50 characters`)
.setColor(Messages.Mconfigs.Ecolor)

const PlaylistExists = new EmbedBuilder()
.setDescription(`Playlist with this name already exists`)
.setColor(Messages.Mconfigs.Ecolor)

const PlaylistDeleted = new EmbedBuilder()
.setDescription(`Playlist sucessfully deleted`)
.setColor(Messages.Mconfigs.Ecolor)

.setTitle(`Playlist`)

const Noplaylist = new EmbedBuilder()
.setDescription(`You don't have any existing playlist yet`)
.setColor(Messages.Mconfigs.Ecolor)

const InvalidPlaylistSelection = new EmbedBuilder()
.setDescription(`Invalid playlist selected!`)
.setColor(Messages.Mconfigs.Ecolor)

export { 
    musBeConnected, 
    SameVc, 
    NothingInQueue, 
    NoPlayer, 
    NotConnected, 
    DevOnly, 
    PlaylistNameERR, 
    PlaylistExists, 
    PlaylistDeleted,
    Noplaylist,
    InvalidPlaylistSelection,
    CommonEmbed

}