import { LavalinkResponse, LoadType, Player, Track } from "shoukaku";
import Queue from "../../Queue.js";
import PlayerStarted from "./playerStarted.js";
import { BaseGuild } from "discord.js";
let isAutoplayInProgress = false;
let HandlingSystem = false;
export async function CheckAutoPlayEnable(x?: Queue) {
    const Db = x.client.prisma.guildData;
    const GuildId = x.guildId;
    const GuildData = await Db.findFirst({
        where: {
            guildId: GuildId,
            autoplay: true,
        }
    });
    let ReturnSwitch: boolean;
    if (GuildData) {
        ReturnSwitch = true;
        x.autoplay = true;
    } else {
        ReturnSwitch = false;
        x.autoplay = false;
    }
    return ReturnSwitch;
}
export async function Autoplay(x: Queue) {
    const lastPreviousTrack = x.previous[x.previous.length - 1];
   // console.log({ 1: lastPreviousTrack?.info?.title, 2: x.previous[x.previous.length - 1]?.info.title })
    const nextTrack: LavalinkResponse | any = await x.player.node.rest.resolve(`ytmsearch:Song by ${lastPreviousTrack.info.author}`);
    if (nextTrack) {
        try {
            if (x.mainmsg) {
                await x.mainmsg.delete();
            }
            const SelectAnumber: number = Math.floor(Math.random() * 10);
            x.tracks.push(nextTrack.data[Math.floor(Math.random() * 10)]);
            await x.play(nextTrack, x.AnnouncementChannel, x.requester, x.CTX);
            x.playing = true;
        } catch (e) {
            //console.log({error:{mainmsg:'true'}})
            x.tracks.push(nextTrack.data[Math.floor(Math.random() * 10)]);
            await x.play(nextTrack, x.AnnouncementChannel, x.requester, x.CTX);
            x.playing = true;
        }
    }
}
