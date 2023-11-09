import { EmbedBuilder } from 'discord.js';
import { Muzox, Queue, Logger, ContextManager, messageCommands, Messages, EmojisPacket } from '../../../Resources/modules/index.js';
import util from 'util';
import { PrismaClient } from '@prisma/client';
export default <messageCommands>{
  data: {
    name: 'ping',
    description: "check the bot's ping/latency",
    // vote: false,
    voice: false,
    queue: false,
    player: false,
    samevc: false,
    botconnection: false,
    slash: true,
    SlashData: {
      Name: 'ping',
      options: []
    },

    permissions: ['SendMessages'],

  },
  execute: async (client: Muzox, message: ContextManager, args: string[]) => {
    

    try {

      if(message.CheckInteraction){
        await message.setDeffered(false);
        const prisma = new PrismaClient();
        const start_ = Date.now();
        await prisma.$connect();
        const end = Date.now();
        const responseTime = end - start_;
        await prisma.$disconnect();
        const start = Date.now();
        await message.reply({
          embeds:[
            new EmbedBuilder().setDescription('Pinging...').setColor(Messages.Mconfigs.Ucolor)
          ]
        });
        const ping = Date.now() - start;

        const Embed = new EmbedBuilder()
        .setColor(Messages.Mconfigs.Ucolor)
        .setDescription(
          `\`\`\`nim\nApi Latency : ${Math.round(client.ws.ping)}ms\nBot Latency : ${ping}ms\nDb Latency  : ${responseTime}ms \`\`\` `
        )

        message.edit({
          embeds: [
            Embed
          ]
        });
        
      } else {
       const x = new EmbedBuilder()
       .setColor(Messages.Mconfigs.Ucolor)
       .setDescription('Pinging...');
        const prisma = new PrismaClient();
        const start_ = Date.now();
        await prisma.$connect();
        const end = Date.now();
        const responseTime = end - start_;
        await prisma.$disconnect();
        const pingMessage = await message.reply({
          embeds:[x]
        });
        const Embed = new EmbedBuilder()
          .setColor(Messages.Mconfigs.Ucolor)
          .setDescription(
            `\`\`\`ts\nApi Latency : ${Math.round(client.ws.ping)}ms\nBot Latency : ${pingMessage.createdTimestamp - message.createdTimestamp}ms\nDb Latency  : ${responseTime}ms \`\`\` `
          )
        pingMessage.edit(
          {
            embeds: [Embed]
          });  
      }
   
    } catch (e) {
      Logger.log(e,"Error")
    }


  }
}