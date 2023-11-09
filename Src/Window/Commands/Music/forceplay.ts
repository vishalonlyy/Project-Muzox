import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { messageCommands } from '../../../Interfaces/Interfaces.js';
import Muzox from '../../../Structures/Muzox_Client.js';
import Messages from '../../../Display/Messages/Messages.js';
import Logger from '../../../Resources/Console/MuzoxConsole.js';
import ContextManager from '../../../Structures/Manager/CTX.js';
import FindQueue from '../../../Display/Utils/FindQueue.js';
import Queue from '../../../Structures/Queue.js';



export default <messageCommands>{
  data: {
    name: 'forceplay',
    description: "Play a song to start the party",
    voice: true,
    queueState: false,
    samevc: false,
    permissions: ['EmbedLinks', 'Speak', 'Connect'],
    aliases: ["fp"],
    slash: true,
    vote: false,
    
    SlashData: {
      name: 'forceplay',
      options: [
        {
          name: 'song',
          description: 'The song you want to play',
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
        },
      ],
    },

  },
  execute: async (client: Muzox, message: ContextManager, args: string[]) => {     
    let searchQuery: string | any;
    try {
      if(message.CheckInteraction){
        await message.setDeffered(false);
       }
       let Engine_: string = 'ytsearch';
        const Engine = await client.prisma.guildData.findUnique({
          where: {
            guildId: message.guild?.id
          }
        })
        if (Engine) {
         Engine_ = Engine.SearchEngine || 'ytsearch';
        } else {
          Engine_ = client.config.searchEngine || 'ytsearch';
        }
        

      const guildId: any = message.guild?.id;
      const node = client.shoukaku.getIdealNode();
      let handler: Queue = null;
      searchQuery = await message.Options('song');
      if(searchQuery.includes('open.spotify')){
        Engine_ = 'spsearch'
      }
      handler  = await FindQueue(client, guildId, message.message || message.ctx ); 
      const result = await node.rest.resolve(`${Engine_ || 'ytsearch'}:${searchQuery}`);
      const metadata = result.data[0];
      if (!result || !metadata) {
        const SearchError = new EmbedBuilder()
          .setColor(Messages.Mconfigs.color)
          .setDescription("No results found based on the title given for the song");
          message.reply({ embeds: [SearchError] });
        
      }



        try {
            if(handler.playing === true){
              await  handler.player.setPaused(true).then(()=> {
                   // handler.skip();
                    handler.push(metadata)
                    handler.player.setPaused(false).then(async ()=> {
                      await  handler.play(metadata, message.channelId, message.author, message.ctx || message.message);
                    })
                })
            } else {
                handler.push(metadata)
              await  handler.play(metadata, message.channelId, message.author, message.ctx || message.message);
            }

        // await handler.forceplay(metadata, message.channelId, message.author, message.ctx || message.message);
      }
        catch (e) {
            Logger.log(e, "Error")
            }
      


    } catch (e) {
      Logger.log(e, "Error")
    }
  }
}
