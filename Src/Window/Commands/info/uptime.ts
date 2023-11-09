import { Message, EmbedBuilder } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, formatTime } from '../../../Resources/modules/index.js';

export default <messageCommands>{
  data: {
    name: 'uptime',
    description: 'display the uptime of the bot',
    vote: false,
    voice: false,
    queue: false,
    player: false,
    samevc: false,
    botconnection: false,
    aliases: ["up"],
    permissions:['EmbedLinks','SendMessages'],
    slash: true,
    SlashData: {
        Name: 'uptime',
        options: []
      },
  },


  execute: async (client: Muzox, message: ContextManager, args: string[]) => {
    try {
      if(message.CheckInteraction){
        await message.setDeffered(false);
    }

      const uptime = formatTime(client.uptime);
      const UptimeEmbed = new EmbedBuilder()
        .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
        .setTitle(`The Uptime Of The Cluster This Server Is In`)
        .setDescription(`\`\`\`ts\n${uptime}\`\`\``)
        .setColor(Messages.Mconfigs.color)
        

      message.reply({
        embeds: [UptimeEmbed]
      });
    } catch (e) {
      
    }
  },
};