/**
 * ⚠️ This File Can Update The Messages All over the bot and Globally
 * 📚  D : Default , C : Common , E: Error
 * 📚  U : User , E : Embed , M : Message , F : Filter
 * 📚  plSn : playlist sub name
 * 📚  X : Emojis
 * Messages are in English, 
 */


import EmojisPacket from "./EmojisPacket.js"
import foreignImporter from "./EmojisPacket.js"






let VoteLink:any = 'https://top.gg/bot/845153824742440991/vote'
let SupportLink:any =  'https://discord.gg/bE6HRhPBDy'
const InviteLink : any = 'https://discord.com/oauth2/authorize?client_id=1170780499187339314&permissions=968552213753&redirect_uri=https%3A%2F%2Fdiscord.gg%2FbE6HRhPBDy&response_type=code&scope=bot%20applications.commands%20guilds.join'
let Dcolor:any = '00FFBD';
let Ecolor:any = '00FFBD';
let Ucolor:any = '00FFBD';
let plSn : any = 'playlist' // playlist sub name
const X = EmojisPacket.Emojis
export default {
    Links :{
        SupportLink: SupportLink,
        InviteLink: InviteLink,
        VoteLink: VoteLink,
        userDisplay : `https://discord.com/users/`,
    },
    Mconfigs: {
        color: Dcolor,
        Ucolor: Ucolor,
        Ecolor: Ecolor,
    },
    Mfilters: {
        AlreadyErasedFilters: `${X.correct} All Filters Has Been Cleared`,
        erasedFilters: `${X.correct} All Filters Has Been Cleared`,
        NoFilters: `${X.Wrong} There are no Filters applied on this track`,
        Activated: `Filter Is Now Activated`,
        Deactivated: `Filter Is Now Deactivated`,
    },
    Messages: {
        thanksforchoosingbotname: "Muzox",
        EnabledAutoPlay : `Enabled Autoplay Mode`,
        DisabledAutoPlay : `Disabled Autoplay Mode`,
        NpButtonsDisabled : `Disabled Now Playing Buttons in`,
        NpButtonsEnabled : `Enabled Now Playing Buttons in`,
        LoadFailed : 'Couldn\'t Find Any Song in The Query You Gave Me',
        songAdd: `Added : `,
        Skipping: `Skipping : `,
        Paused: `Paused :`,
        resumed: `Resumed : `,
        trackcleared: `Successfuly Cleared The Queue`,
        StopAndCleared: `Stopped The Player & Cleared The Queue`,

        //Normal Commands
        join : `${X.correct} Successfully Joined・`,
        leave: `Connection sucessfully deactived in : `,
        //Settings Embeds 
        prefix: `Guild Prefix Has Been Updated To : `,
        Active_247 : `Activated 24/7 Mode in`,
        DeActivated_247 : `Deactivated 24/7 Mode in`,
        Shuffled : `Successfuly Shuffled The Queue`,
        RewindDeafult : `Rewinded The Track Duration To - `,
        ForwardDeafult : `Forwarded The Track Duration To - `,
        ShuffleDeafult : `Successfuly Shuffled The Queue`,
        SkipDeafult : `Skipped The Current Track`,
        LoopDisabled : `Loop Mode is Now **Disabled**`,
        LoopEnabled : `Loop Mode is Now Set To`,
        PreviousDeafult : `Playing The Previous Track`,


    },
    Title:{
        Cerror: `Error`,
        QueueEnd: 'Queue Ended',
        NowPlaying: `NOW PLAYING`,
        PlayerStopped: `Player Stopped`,
    },
    Utils:{
        QueueEnded:`Queue More Songs To Keep The Party Going`,
        somewhereplaying: `There is something playing in the server already , try again later or use the \`stop or disconnect\` command to stop or fix the issue`,
    },
    Error:{
        AlreadyPaused: `The Player is Not Paused`,
        alreadyResumed: `The songs are already being played in the server's vc`,
        alreadyJoined: `My connection is already established in a server's vc` ,
        alreadyDisconnected: `My connections are not established in any of the voice channel yet in this server` ,
        notsameVC: `You are not in the same voice channel as me`,
        Permission_SendMessage: `I don't have the required permissions to send messages in this channel, please give me the required permissions to run this command : \`SendMessages\` , \`EmbedLinks\``,
        NoQueue : `There is no queue in this server yet, use the \`play\` command to add songs to the queue`,
        Support: `There was an error while running this command, please contact support if this error persists [Join Support](${SupportLink})`,
        permission : `You don't have the required permissions to run this command`,
        NothingInQueue: `Currently i'am Not Playing Anything in This Server`,
        UserNotConnected : `You Must Be In Voice Channel To Use This Command`,
        BotNotConnected : `I Must Be In Voice Channel To Use This Command`,
        VoiceChannelFull : `Voice Channel You Are in Has Reached it Maximum Limit・`,
        VoiceChannelNotViewable : `Voice Channel You Are in is Either Locked or Non Viewable`,
        Permission_EmbedLinks : `I don't have the required permissions in this channel : \`EmbedLinks\``,
        NoSongsInQueue : `There Is Nothing In The Queue`,
    
    },
    
    help :{
        about : `Hey It's Me Muzox a Versatile Music Bot With The Crisp of Awesome Music Quality With Over Powered Features`,
        musiclist : `\`clear\`, \`skip\`, \`seek\`, \`move\`, \`join\`, \`disconnect\`, \`play\`, \`playnext\`, \`remove\`, \`removedupes\`, \`forward\`, \`rewind\`, \`nowplaying\`, \`loop\`, \`volume\`, \`queue\`, \`shuffle\`, \`stop\`, \`pause\`, \`resume\`, \`search\``,
        filterslist : `\`8d\`, \`distorsion\`, \`karaoke\`, \`nightcore\`, \`pitch\`, \`reset\`, \`rotation\``,
        // filterslist : `\`8d\` \`bass\` \`bassboost\` \`speed\` \`party\` \`terriblebass\` \`vaporwave\` \`chipmunk\` \`equalizer\` \`nightcore\``,
        settingslist : `\`prefix\`, \`247\`, \`autoplay\`, \`engine\`, \`buttons\`, \`resetsettings\`, \`setchannel\`, \`settings\`, \`clean\` `,
        infolist : `\`db\`, \`dbping\`, \`premiumcheck\`, \`profile\`, \`botinfo\`, \`about\`, \`node\`, \`ping\`, \`hostping\`, \`uptime\`, \`connections\`, \`shard\`, \`help\`, \`vote\`, \`invite\`, \`support\``,
        playlistlist : `\`playlist\`, \`playlist help\`, \`playlist create\`, \`playlist delete\`, \`playlist play\`, \`playlist load\`, \`playlist list\`, \`playlist info\`, \`playlist addtrack\`, \`playlist removetrack\``,
    }
  
}