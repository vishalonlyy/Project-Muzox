import { CommandInteraction, Message, Shard } from "discord.js";
import { Player } from "shoukaku";
import { Queue, Muzox } from "../../Resources/modules/index.js"

export default async function FindQueue(client : Muzox, guildId: string , message :  Message | CommandInteraction){
    const node = client.shoukaku.getIdealNode();
    let player : Player = node.players.get(guildId);
    let guild : any;
    let user: any;


    // @ts-ignore
    let memberid: string;
    let voiceState : any;
    let bVc : any;
    let bVcCheck : any;
    let guildId_ : any;
    let channelId : any;

    let shardId: Shard | any;

   

    if(message instanceof CommandInteraction){
        guild = message?.guild;
        user = message.member?.user;

        memberid = message.member?.user.id;
        voiceState = message.guild?.voiceStates.cache.get(memberid);
        bVc = message.guild?.members.me;
        bVcCheck= message.guild?.voiceStates.cache.get(bVc);
        guildId_ = message.guild?.id;
        channelId = voiceState?.channelId;

        shardId = message.guild?.shardId;
    }else{
        guild = message?.guild;
        user = message?.author;

        memberid = message?.member?.user.id;
        voiceState = message?.guild?.voiceStates.cache.get(memberid);
        bVc = message?.guild?.members.me;
        bVcCheck= message?.guild?.voiceStates.cache.get(bVc);
        guildId_ = message?.guild?.id;
        channelId = voiceState?.channelId;

        shardId = message?.guild?.shardId;
    }


    // if(!guildId || !channelId || !guild || !user || !memberid || !voiceState || !bVc || !bVcCheck || !guildId_ || !shardId){
    //     }
    if(!player){
        player = await client.shoukaku.joinVoiceChannel({
            guildId: guildId,
            channelId: channelId,
            shardId: message.guild?.shardId,
            deaf: true,
        });

    } else {
        console.error();
    }

    if (!client.queue.has(guildId)) {
        client.queue.set(guildId, new Queue(guildId,player));
      }
      return client.queue.get(guildId);

}