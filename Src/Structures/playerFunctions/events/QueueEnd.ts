import { EmbedBuilder, ActionRowBuilder, AnyComponentBuilder, Message } from "discord.js";
import { VoteButtonStructure, InviteButttonStructure } from "../../../Display/GlobalEmbeds/privateButtons.js";
import { Logger, Messages, Queue } from "../../../Resources/modules/index.js";
import { Autoplay, CheckAutoPlayEnable } from "./autoplay.js";

async function QueueEnd(x:Queue){
    x.mainmsg.delete().catch(e => { })

    let checkerForAutoPlaySwitch: boolean = await CheckAutoPlayEnable(x);

    if (x.loop === 2 && checkerForAutoPlaySwitch) {
      checkerForAutoPlaySwitch = false;
    }
    if (x.loop === 2 && !checkerForAutoPlaySwitch) {
      x.player.setPaused(true);
      Promise.all([
        x.playing = true,
        x.autoplay = false,
        x.previous = [],
        x.tracks = [],
      ]).then(async () => {
        for (let i = 0; i < x.LoopQueueData.length; i++) {
          if (i === 1) {
            x.player.setPaused(false);
            x.player.stopTrack();
          }
          x.tracks.push(x.LoopQueueData[i]);
        }
      })
    }

    if (x.loop !== 2 && !checkerForAutoPlaySwitch) {
      
      Promise.all([x.playing=false,x.tracks=[],x.previous =[], x.loop=0, x.autoplay=false,x.LoopQueueData=[,x.stopped=true]]).then(async ()=>{await x.mainmsg.delete().catch(e=>{})})
      .then(async () => { x.client.queue.delete(x.guildId) })
      .then(async ()=> { await send(x)})
      async function send(z: Queue) {
        const endEmbed = new EmbedBuilder()
          .setAuthor({ name: `${Messages.Title.QueueEnd}`, iconURL: z.client.user.avatarURL(), url: Messages.Links.SupportLink })
          .setColor(Messages.Mconfigs.Ecolor)
          .setDescription(Messages.Utils.QueueEnded)
        const x: ActionRowBuilder<AnyComponentBuilder> | any = new ActionRowBuilder().addComponents(
          VoteButtonStructure, InviteButttonStructure
        )
        try {
          if (z.CTX instanceof Message) {
            await z?.CTX?.channel?.send({
              embeds: [endEmbed],
              components: [x]
            }).catch(e => Logger.log(e, 'Error'))
          } else {
            await z.CTX.editReply({
              content: '',
              embeds: [endEmbed],
              components: [x]
            });
          }
        } catch (e) {
          Logger.log(e, 'Error')
        }
      }
    }
    else if (checkerForAutoPlaySwitch) {
      await Autoplay(x)
    } 
}


export default QueueEnd;