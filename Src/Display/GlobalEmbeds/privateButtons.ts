import { ActionRowBuilder, AnyComponentBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Messages, EmojisPacket } from "../../Resources/modules/index.js"

const VoteButtonStructure = new ButtonBuilder()
  .setLabel('Vote')
  .setEmoji('1054805676653826128')
  .setURL(Messages.Links.VoteLink)
  .setStyle(ButtonStyle.Link);

const SupportButtonStructure = new ButtonBuilder()
  .setLabel('Support')
  .setEmoji('1054805690876694558')
  .setURL(Messages.Links.SupportLink)
  .setStyle(ButtonStyle.Link)

const InviteButttonStructure = new ButtonBuilder()
  .setLabel('Invite')
  .setEmoji('1054805698120261662')
  .setURL(Messages.Links.InviteLink)
  .setStyle(ButtonStyle.Link)

const NextButtonStructure = new ButtonBuilder()
  .setCustomId('next')
  .setEmoji(EmojisPacket.Emojis.rightArrow)
  .setStyle(ButtonStyle.Secondary)

const PreviousButtonStructure = new ButtonBuilder()
  .setCustomId('previous')
  .setEmoji(EmojisPacket.Emojis.leftArrow)
  .setStyle(ButtonStyle.Secondary)

const TotalNextButtonStructure = new ButtonBuilder()
  .setCustomId('Tnext')
  .setEmoji(EmojisPacket.Emojis.DownsideArrow)
  .setStyle(ButtonStyle.Secondary)

const TotalPreviousButtonStructure = new ButtonBuilder()
  .setCustomId('Tprevious')
  .setEmoji(EmojisPacket.Emojis.UpsideArrow)
  .setStyle(ButtonStyle.Secondary)

const YesButtonStructure = new ButtonBuilder()
  .setCustomId('Yes')
  .setLabel('Yes')
  .setStyle(ButtonStyle.Success)

const NoButtonStructure = new ButtonBuilder()
  .setCustomId('No')
  .setLabel('No')
  .setStyle(ButtonStyle.Danger)

// Builded Buttons
const allButton = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(InviteButttonStructure, SupportButtonStructure, VoteButtonStructure)

const NextPreviousButtons = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(PreviousButtonStructure,NextButtonStructure)

const FourPageSwitchButtons = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(TotalPreviousButtonStructure, PreviousButtonStructure, NextButtonStructure, TotalNextButtonStructure)


const NextButton = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(NextButtonStructure)

const PreviousButton = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(PreviousButtonStructure)

const VoteButton = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(VoteButtonStructure)

const SupportButton = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(SupportButtonStructure)

const InviteButton = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(InviteButttonStructure)
//Builded Buttons for Simple Components
const YesButtons = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(YesButtonStructure)

const NoButtons = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(NoButtonStructure)

const YesNoButtons = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(YesButtonStructure, NoButtonStructure)



//Music Playing Buttons with structures & Rows <<Action Buttons>>

const StopButton_Structure = new ButtonBuilder().setCustomId("stop").setEmoji(EmojisPacket.Emojis.TracKStart.stop).setStyle(ButtonStyle.Secondary);
const PauseButton_Structure = new ButtonBuilder().setCustomId("pause").setEmoji(EmojisPacket.Emojis.TracKStart.pause).setStyle(ButtonStyle.Secondary);
const But_Paused_to_Resume_Changer_Structure = new ButtonBuilder().setCustomId("resume1").setEmoji(EmojisPacket.Emojis.TracKStart.resume).setStyle(ButtonStyle.Success)
const SkipButton_Structure = new ButtonBuilder().setCustomId("skip").setEmoji(EmojisPacket.Emojis.TracKStart.skip).setStyle(ButtonStyle.Secondary);
const LoopButton_Structure = new ButtonBuilder().setCustomId("repeat").setEmoji(EmojisPacket.Emojis.TracKStart.loop).setStyle(ButtonStyle.Secondary);
const LoopButtonCancel_Structure = new ButtonBuilder().setCustomId("repeat_cancel").setEmoji(EmojisPacket.Emojis.TracKStart.loop).setStyle(ButtonStyle.Secondary);
const ForwardButton_Structure = new ButtonBuilder().setCustomId("forward").setEmoji(EmojisPacket.Emojis.TracKStart.Forward).setStyle(ButtonStyle.Secondary);
const Revind_Structure = new ButtonBuilder().setCustomId("backward").setEmoji(EmojisPacket.Emojis.TracKStart.Revind).setStyle(ButtonStyle.Secondary);
const PreviousSong_Structure = new ButtonBuilder().setCustomId("previous").setEmoji(EmojisPacket.Emojis.TracKStart.previous).setStyle(ButtonStyle.Secondary);
const NextSong_Structure = new ButtonBuilder().setCustomId("next").setEmoji(EmojisPacket.Emojis.TracKStart.next).setStyle(ButtonStyle.Secondary);
const Queue_Structure = new ButtonBuilder().setCustomId("queue").setEmoji(EmojisPacket.Emojis.TracKStart.queue).setStyle(ButtonStyle.Secondary);
const Like_Structure = new ButtonBuilder().setCustomId("like").setEmoji(EmojisPacket.Emojis.TracKStart.like).setStyle(ButtonStyle.Secondary);
const Shuffle_Structure = new ButtonBuilder().setCustomId("shuffle").setEmoji(EmojisPacket.Emojis.TracKStart.shuffle).setStyle(ButtonStyle.Secondary);
const Shuffle_Cancel_Structure = new ButtonBuilder().setCustomId("shuffle_cancel").setEmoji(EmojisPacket.Emojis.TracKStart.shuffle).setStyle(ButtonStyle.Secondary);

const MusicPlaying_FirstRow: any = new ActionRowBuilder<AnyComponentBuilder>()
  .addComponents(PauseButton_Structure, SkipButton_Structure, LoopButton_Structure, StopButton_Structure);//Pause, Skip, Loop, Stop
const MusicPlaying_LoopClicked: any = new ActionRowBuilder().addComponents(But_Paused_to_Resume_Changer_Structure, SkipButton_Structure, LoopButton_Structure, StopButton_Structure);
//LoopInactivate, Skip, Loop, Stop
const MusicPlaying_StopClicked: any = new ActionRowBuilder().addComponents(PauseButton_Structure, SkipButton_Structure, LoopButton_Structure, StopButton_Structure)
const MusicPlaying_LoopCancelled = new ActionRowBuilder().addComponents(PauseButton_Structure, SkipButton_Structure, LoopButtonCancel_Structure, StopButton_Structure)



const Muzox_Playing_FirstRow: ActionRowBuilder<AnyComponentBuilder> | any = new ActionRowBuilder().addComponents(
  PreviousSong_Structure, Revind_Structure, PauseButton_Structure, ForwardButton_Structure, NextSong_Structure
)
const Muzox_Playing_SecondRow: ActionRowBuilder<AnyComponentBuilder> | any = new ActionRowBuilder().addComponents(
  LoopButton_Structure, Queue_Structure, Like_Structure, StopButton_Structure, Shuffle_Structure
)

const Muzox_PauseClicked: ActionRowBuilder<AnyComponentBuilder> | any = new ActionRowBuilder().addComponents(
  PreviousSong_Structure, Revind_Structure, But_Paused_to_Resume_Changer_Structure, ForwardButton_Structure, NextSong_Structure
)

const Muzox_PauseCancelled: ActionRowBuilder<AnyComponentBuilder> | any = new ActionRowBuilder().addComponents(
  PreviousSong_Structure, Revind_Structure, PauseButton_Structure, ForwardButton_Structure, NextSong_Structure
)

const Muzox_StopClicked: ActionRowBuilder<AnyComponentBuilder> | any = new ActionRowBuilder().addComponents(
  PreviousSong_Structure, Revind_Structure, PauseButton_Structure, ForwardButton_Structure, NextSong_Structure
)


const Muzox_LoopClicked: ActionRowBuilder<AnyComponentBuilder> | any = new ActionRowBuilder().addComponents(
  LoopButtonCancel_Structure, Queue_Structure, Like_Structure, StopButton_Structure, Shuffle_Structure
)

const Muzox_LoopCancelled: ActionRowBuilder<AnyComponentBuilder> | any = new ActionRowBuilder().addComponents(
  LoopButton_Structure, Queue_Structure, Like_Structure, StopButton_Structure, Shuffle_Structure
)

const Muzox_ShuffleClicked: ActionRowBuilder<AnyComponentBuilder> | any = new ActionRowBuilder().addComponents(
  LoopButton_Structure, Queue_Structure, Like_Structure, StopButton_Structure, Shuffle_Cancel_Structure
)


// const TrackQueueEND bUTTONS : ActionRowBuilder<Any

export {

  //Strctures 
  VoteButtonStructure,
  InviteButttonStructure,
  allButton,
  SupportButton,
  VoteButton,
  InviteButton,
  NextPreviousButtons,
  NextButton,
  PreviousButton,
  FourPageSwitchButtons,
  YesButtonStructure,
  NoButtonStructure,
  //Simple Buttons<Action Buttons CustomId("string")>
  YesButtons,
  NoButtons,
  YesNoButtons,


  //Music Playing Buttons
  MusicPlaying_FirstRow,
  MusicPlaying_LoopClicked,
  MusicPlaying_StopClicked,
  MusicPlaying_LoopCancelled,

  //Muzox Playing Buttons
  Muzox_Playing_FirstRow,
  Muzox_Playing_SecondRow,
  Muzox_PauseClicked,
  Muzox_PauseCancelled,
  Muzox_StopClicked,
  Muzox_LoopClicked,
  Muzox_LoopCancelled,
  Muzox_ShuffleClicked


}